// System imports
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';

// Module imports
import { Results, Result } from 'route-recognizer';
import * as deepExtend from 'deep-extend';
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
const RouteRecognizer = require('route-recognizer');

// Internal imports
import { 
    IRoutes, IRoute,  IContext, INamedPattern, 
    IRouteResponse, IRouterTask, IRouterTasks, 
    IMenus, IPartials, ILayouts
} from './interfaces';
import { RouteMatch } from './route-match';

/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
export class Router implements IContext {
    name: string;
    domains: string[];
    metaData: any;
    menus: IMenus;
    routes: IRoutes;
    template: string;
    uaId: string;
    templatePartials: IPartials;
    layouts: ILayouts;
    routerTasks: IRouterTasks = {};

    private routeRecognizer: any;
    private defaultResult: Result;

    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    constructor(private context: IContext, routerTasks: IRouterTask[]){
        Object.assign(this, context);

        console.log('#### ROUTER.constructor() -> Registering router tasks', routerTasks);

        routerTasks.forEach((routerTask: IRouterTask) => {
            this.routerTasks[routerTask.name] = routerTask;
        });

        console.log('#### ROUTER.constructor() -> Router Tasks:', util.inspect(this.routerTasks, false, null, true));

        console.log('#### ROUTER.constructor() -> Same old router setup');

        // Setup our route recognizer
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        // Loop through each route in the current context
        Object.keys(this.routes).forEach((routeName: string) => {
            // Create a new Route object
            var route: IRoute = this.routes[routeName];
            route.name = routeName;
            if(routeName === '_default'){
                // Treat routes called `_default` as the default handler
                this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }else{
                // Any other route needs to be added to our RouteRecognizer
                if(typeof route.pattern === 'string'){
                    var routeDef = {
                        path: route.pattern,
                        handler: route
                    };
                    this.routeRecognizer.add([routeDef], { as: routeName });
                }else{
                    Object.keys(route.pattern).forEach((suffix: string) => {
                        var routeDef = {
                            path: route.pattern[suffix],
                            handler: route
                        };
                        this.routeRecognizer.add([routeDef], { as: routeName + '_' + suffix });
                    });
                }
            }
        });
    }

    public generateUrl(routeName: string, params: any) {
        var url = this.routeRecognizer.generate(routeName, params);
        return url;
    }

    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    public async execute(uriString: string): Promise<IRouteResponse>{
        try {
            console.log('#### ROUTER.execute() -> Matching router:', uriString);

            var routeMatch = await this.matchRoute(uriString);

            console.log('[ROUTER], \n\tURL:', uriString, '\n\tMatch:', routeMatch.route.name, '\n\tParams:', routeMatch.params);

            await routeMatch.execute();
           
            console.log('#### ROUTER.execute() -> All done. returning response');

            return routeMatch.response;
        } catch(err) {
            throw err;
        }
    }

    private async matchRoute(uriString: string): Promise<RouteMatch> {
        var uri: url.Url = url.parse(uriString);

        var recognizedRoutes: Results = this.routeRecognizer.recognize(uri.path) || [this.defaultResult];
        var firstResult: Result = recognizedRoutes[0] || this.defaultResult;
        var handler: IRoute = <IRoute>firstResult.handler;

        var params = {};
        Object.assign(params, handler.defaultParams);
        Object.assign(params, firstResult.params);

        var query = querystring.parse(uri.query, handler.queryDelimiter, handler.queryEquals);
        var idFriendlyPath = uri.pathname.replace(/\//g, '_');
        if(idFriendlyPath.startsWith('_')){
            idFriendlyPath = idFriendlyPath.substr(1);
        }
        deepExtend(params, { query: query, path: idFriendlyPath, uri: uri });

        //console.log('#### ROUTER.matchRoute() -> Matched route:', handler, params);
        var routeMatch: RouteMatch = new RouteMatch(handler, params, this);
        return routeMatch;
    }
}
