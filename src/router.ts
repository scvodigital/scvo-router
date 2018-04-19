// System imports
import * as deepExtend from 'deep-extend';
import * as fs from 'fs';
import * as querystring from 'querystring';
// Module imports
import {Result, Results} from 'route-recognizer';
import * as url from 'url';
import * as util from 'util';
const routeRecognizer = require('route-recognizer');

// Internal imports
import {MenuDictionary, NamedPattern, RouteConfiguration, RouteMap, RouterConfiguration, RouterDestinationMap, RouterRequest, RouterResponse, RouterTaskMap} from './interfaces';
import {RouteDestinationError, RouteError, RouteTaskError} from './route-errors';
import {RouteMatch} from './route-match';
import {RouterDestination} from './router-destination';
import {RouterTask} from './router-task';

/**
 * Class for managing incoming requests, routing them to Elasticsearch queries,
 * and rendering output
 */
export class Router implements RouterConfiguration {
  name: string = '';
  domains: string[] = [];
  metaData: {} = {};
  menus: MenuDictionary = {};
  routes: RouteMap = {};
  uaId: string = '';
  routerTasks: RouterTaskMap = {};
  routerDestinations: RouterDestinationMap = {};

  /* tslint:disable:no-any */
  private routeRecognizer: any;
  /* tslint:enable:no-any */

  private defaultResult: Result | null = null;

  /**
   * Create a Router for matching routes and rendering responses
   * @param {RouteMap} routes The routes and their configurations we are matching against
   */
  constructor(
      private context: RouterConfiguration, routerTasks: RouterTask[],
      routerDestinations: RouterDestination[]) {
    Object.assign(this, context);

    // console.log('#### ROUTER.constructor() -> Registering router tasks',
    // routerTasks);

    routerTasks.forEach((routerTask: RouterTask) => {
      this.routerTasks[routerTask.name] = routerTask;
    });

    routerDestinations.forEach((routerDestination: RouterDestination) => {
      this.routerDestinations[routerDestination.name] = routerDestination;
    });

    // console.log('#### ROUTER.constructor() -> Router Tasks:',
    // util.inspect(this.routerTasks, false, null, true));

    // console.log('#### ROUTER.constructor() -> Same old router setup');

    // Setup our route recognizer
    this.routeRecognizer = new routeRecognizer();
    // Loop through each route in the current context
    Object.keys(this.routes).forEach((routeName: string) => {
      // Create a new Route object
      const route: RouteConfiguration = this.routes[routeName];
      route.name = routeName;
      route.acceptedVerbs =
          !route.acceptedVerbs || route.acceptedVerbs.length === 0 ?
          '*' :
          route.acceptedVerbs;
      if (routeName === '_default') {
        // Treat routes called `_default` as the default handler
        this.defaultResult = {handler: route, isDynamic: true, params: {}};
      } else {
        // Any other route needs to be added to our RouteRecognizer
        if (typeof route.pattern === 'string') {
          const routeDef = {path: route.pattern, handler: route};
          this.routeRecognizer.add([routeDef], {as: routeName});
        } else {
          Object.keys(route.pattern).forEach((suffix: string) => {
            const routeDef = {
              path: (route.pattern as NamedPattern)[suffix],
              handler: route
            };
            this.routeRecognizer.add(
                [routeDef], {as: routeName + '_' + suffix});
          });
        }
      }
    });
  }

  /**
   * Execute the route against a URI to get a matched route and rendered
   * responses
   * @param {string} uriString - The URI to be matched
   * @return {RouteMatch} The matched route with rendered results
   */
  async execute(request: RouterRequest): Promise<RouterResponse> {
    try {
      // console.log('#### ROUTER.execute() -> Matching router:', uriString);

      const routeMatch = await this.matchRoute(request);

      console.log(
          '[ROUTER], Request:', routeMatch.request.fullUrl,
          '| Match:', routeMatch.route.name);

      const response: RouterResponse = await this.executeRoute(routeMatch);

      return response;
    } catch (err) {
      throw err;
    }
  }

  private async matchRoute(request: RouterRequest): Promise<RouteMatch> {
    const uri: url.Url = request.url;

    const recognizedRoutes: Results|null =
        this.routeRecognizer.recognize(request.url.path || '') || null;
    const validResults: Result[] = [];

    if (recognizedRoutes) {
      recognizedRoutes.slice(0).forEach((result: Result) => {
        const route: RouteConfiguration = result.handler as RouteConfiguration;
        if (route.acceptedVerbs === '*') {
          validResults.push(result);
        } else {
          if (route.acceptedVerbs.indexOf(request.verb) > -1) {
            validResults.push(result);
          }
        }
      });
    }

    const firstResult: Result = validResults[0] || this.defaultResult;
    const handler: RouteConfiguration =
        firstResult.handler as RouteConfiguration;

    const params = {};
    Object.assign(params, handler.defaultParams);
    Object.assign(params, firstResult.params);

    let query = querystring.parse(
        uri.query, handler.queryDelimiter, handler.queryEquals);
    let idFriendlyPath = (uri.pathname || '').replace(/\//g, '_');
    if (idFriendlyPath.startsWith('_')) {
      idFriendlyPath = idFriendlyPath.substr(1);
    }

    // Fix annoying "[]" in array property names in query string
    var queryParams = Object.keys(query);
    queryParams.forEach((param: string) => {
      if (param.indexOf('[]') === param.length - 2) {
        var newParam = param.substr(0, param.length - 2);
        var value = query[param];
        if (!Array.isArray) {
          query[newParam] = [value];
        } else { 
          query[newParam] = value;
        }
        delete query[param];
      }      
    });

    deepExtend(params, {query, path: idFriendlyPath, uri});

    request.params = params;

    // console.log('#### ROUTER.matchRoute() -> Matched route:', handler,
    // params);
    const routeMatch: RouteMatch = new RouteMatch(handler, request, this);
    return routeMatch;
  }

  private async executeRoute(routeMatch: RouteMatch): Promise<RouterResponse> {
    try {
      const response = await routeMatch.execute();
      return response;
    } catch (err) {
      if (!(err instanceof RouteError)) {
        err = new RouteError(err, {
          statusCode: 500,
          sourceRoute: routeMatch,
          redirectTo: routeMatch.route.errorRoute,
          data: {}
        });
      }

      if (!this.routes.hasOwnProperty(err.redirectTo)) {
        console.log(
            '#### ROUTER.executeRoute() -> Error thrown in route "',
            routeMatch.route.name, '" but no where to redirect');
        throw err;
      }

      const newRoute = this.routes[err.redirectTo];
      if (routeMatch.route.name === newRoute.name) {
        console.log(
            '#### ROUTER.executeRoute() -> Recursion detected! "',
            routeMatch.route.name, '" is redirecting to "', newRoute.name, '"');
        throw err;
      }

      routeMatch.route = newRoute;
      console.log(
          '#### ROUTER.executeRoute() -> About to redirect:',
          routeMatch.route.name);
      return await this.executeRoute(routeMatch);
    }
  }
}
