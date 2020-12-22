import Ajv = require('ajv');
import dot = require('dot-object');

import {RouteConfiguration, RouteMap, RouterConfiguration, RouterRequest, RouterResponse, RouteTaskConfiguration} from './configuration-interfaces';
import {MatchedRoute, RegisteredRoute} from './registered-route';
import {RendererManager, RendererMap} from './renderer-manager';
import {RouteMatch} from './route-match';
import {TaskModuleManager, TaskModuleMap} from './task-module-manager';

import {CacheManager} from './cache-manager';

// const routerConfigurationSchema =
// require('./router-configuration.schema.json');

/* tslint:disable:no-any */
export class Router {
  registeredRoutes: RegisteredRoute[] = [];
  defaultRoute: RouteConfiguration = {
    acceptedVerbs: ['GET'],
    defaultParams: {},
    metaData: {},
    name: 'default',
    pattern: '/',
    queryDelimiter: '&',
    queryEquals: '=',
    tasks: []
  };
  taskModuleManager: TaskModuleManager;
  rendererManager: RendererManager;
  cacheManager = new CacheManager();

  checkResponses: RouterConfigurationCheckResponse[] = [];
  get hasErrors(): boolean {
    for (let i = 0; i < this.checkResponses.length; ++i) {
      const checkResponse = this.checkResponses[i];
      if (checkResponse.level === RouterConfigurationCheckResponseLevel.ERROR) {
        return true;
      }
    }
    return false;
  }

  constructor(
      private context: RouterConfiguration, taskModuleMap: TaskModuleMap,
      private rendererMap: RendererMap) {
    this.taskModuleManager = new TaskModuleManager(taskModuleMap);
    this.rendererManager = new RendererManager(rendererMap);

    this.checkConfiguration();

    if (!this.hasErrors) {
      context.routes.forEach((route) => {
        const registeredRoute = new RegisteredRoute(route);
        this.registeredRoutes.push(registeredRoute);
        if (route.name === 'default') {
          this.defaultRoute = route;
        }
      });
    }
  }

  checkConfiguration() {
    const ajv = new Ajv();
    const valid =
        true;  // ajv.validate(routerConfigurationSchema, this.context);
    if (!valid) {
      this.checkResponses.push({
        source: RouterConfigurationCheckResponseSource.ROUTER_CONFIGURATION,
        level: RouterConfigurationCheckResponseLevel.ERROR,
        location: 'root',
        error: 'Invalid Router Configuration: ' +
            JSON.stringify(ajv.errors, null, 4),
        solution:
            'The Router Configuration object that has been passed into the Router does not pass basic checks against the Router Configuration Schema. Please check the documentation and make sure you are passing in the correct object. No further checks will be performed'
      });
      return;
    }

    const routeNames: string[] = [];
    this.context.routes.forEach((route) => {
      if (routeNames.indexOf(route.name) > -1) {
        this.checkResponses.push({
          source:
              RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
          level: RouterConfigurationCheckResponseLevel.ERROR,
          location: route.name,
          error: 'Multiple routes with the same name',
          solution:
              'Route names MUST be unique, try renaming one of the routes called "' +
              route.name + '"'
        });
      } else {
        routeNames.push(route.name);
      }

      if (route.errorRoute === route.name) {
        this.checkResponses.push({
          source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
          location: route.name,
          level: RouterConfigurationCheckResponseLevel.WARNING,
          error: 'Possible reroute recursion',
          solution:
              'Change the errorRoute of this route to something other than itself'
        });
      }

      const taskNames: string[] = [];
      route.tasks.forEach((taskVal) => {
        let task: RouteTaskConfiguration<any>|undefined;
        if (typeof taskVal === 'string') {
          if (taskVal.indexOf('context.') === 0) {
            const newTaskPath = taskVal.replace(/^context\./, '');
            task = dot.pick(newTaskPath, this.context) as
                RouteTaskConfiguration<any>;
          }
        } else {
          task = taskVal as RouteTaskConfiguration<any>;
        }

        if (!task) return;

        if (taskNames.indexOf(task.name) > -1) {
          this.checkResponses.push({
            source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
            level: RouterConfigurationCheckResponseLevel.ERROR,
            location: route.name,
            error: 'Multiple tasks with the same name exist',
            solution:
                'Route task names MUST be unique, try renaming one of the route tasks called "' +
                task.name + '"'
          });
        }

        if (!this.taskModuleManager.hasTaskModule(task.taskModule)) {
          this.checkResponses.push({
            source:
                RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
            location: route.name + ' -> ' + task.name,
            level: RouterConfigurationCheckResponseLevel.ERROR,
            error: 'Task Module "' + task.taskModule + '" does not exist',
            solution: 'Check that a Task Module called "' + task.taskModule +
                '" has been loaded and that its spelling is correct'
          });
        }

        if (task.renderer &&
            !this.rendererManager.hasRenderFunction(task.renderer)) {
          this.checkResponses.push({
            source:
                RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
            location: route.name + ' -> ' + task.name,
            level: RouterConfigurationCheckResponseLevel.ERROR,
            error: 'Renderer "' + task.renderer + '" does not exist',
            solution: 'Check that a Renderer called "' + task.renderer +
                '" has been loaded and that its spelling is correct'
          });
        }
      });
    });
  }

  async go(request: RouterRequest): Promise<RouterResponse> {
    try {
      if (this.hasErrors) {
        return {
          body: JSON.stringify(this.checkResponses),
          contentType: 'application/json',
          cookies: {},
          headers: {},
          statusCode: 500,
          doNotZip: false
        };
      }
      const matchedRoute = this.matchRoute(request);
      const routeMatch = new RouteMatch(
          matchedRoute, request, this.context, this.taskModuleManager,
          this.rendererManager, this.cacheManager);
      const response = await routeMatch.execute();
      return response;
    } catch (err) {
      if (!this.context.disasterResponse) {
        return {
          body: 'Server Error 500',
          contentType: 'text/html',
          cookies: {},
          headers: {},
          statusCode: 500,
          doNotZip: false
        };
      } else {
        return this.context.disasterResponse;
      }
    }
  }

  matchRoute(request: RouterRequest): MatchedRoute {
    request.url.path =
        (request.url.path || '').replace(/\/(\?|$)/i, '$1') || '/';
    request.url.pathname =
        (request.url.pathname || '').replace(/\/(\?|$)/i, '$1') || '/';
    let match: MatchedRoute|null = null;
    for (let i = 0; i < this.registeredRoutes.length; ++i) {
      const route = this.registeredRoutes[i];
      match = route.test(request);
      if (match) break;
    }
    if (!match) {
      match = {config: this.defaultRoute, params: {}};
    }
    return match;
  }
}
/* tslint:enable:no-any */

export interface RouterConfigurationCheckResponse {
  source: RouterConfigurationCheckResponseSource;
  level: RouterConfigurationCheckResponseLevel;
  location: string;
  error: string;
  solution?: string;
}

export enum RouterConfigurationCheckResponseSource {
  ROUTER_CONFIGURATION,
  ROUTE_CONFIGURATION,
  ROUTE_TASK_CONFIGURATION,
  RENDERER,
  TASK_MODULE
}

export enum RouterConfigurationCheckResponseLevel {
  INFO,
  WARNING,
  ERROR
}