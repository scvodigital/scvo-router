// System imports
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';

// Module imports
import { Results, Result } from 'route-recognizer';
// Sillyness. See: https://github.com/tildeio/route-recognizer/issues/136
const RouteRecognizer = require('route-recognizer');

// Internal imports
import { IRoutes, IRouteMatch } from './interfaces';
import { Route } from './route';
import { RouteMatch } from './route-match';

/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
export class Router {
    private routeRecognizer: any;
    private defaultResult: Result;
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    constructor(private routes: IRoutes){
        // Setup our route recognizer
        this.routeRecognizer = RouteRecognizer.default ? new RouteRecognizer.default() : new RouteRecognizer();
        // Loop through each route in the current context
        Object.keys(routes).forEach((routeName: string) => {
            // Create a new Route object
            var route: Route = new Route(routes[routeName]);
            route.name = routeName;        
            if(routeName === '_default'){
                // Treat routes called `_default` as the default handler
                this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }else{
                // Any other route needs to be added to our RouteRecognizer
                var routeDef = {
                    path: route.pattern,
                    handler: route
                };
                this.routeRecognizer.add([routeDef]);
            }
        });
    }

    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    public execute(uriString: string): Promise<IRouteMatch>{
        return new Promise<IRouteMatch>((resolve, reject) => {
            var uri: url.Url = url.parse(uriString);

            var recognizedRoutes: Results = this.routeRecognizer.recognize(uri.path) || [this.defaultResult];
            var firstResult: Result = recognizedRoutes[0] || this.defaultResult;
            var handler: Route = <Route>firstResult.handler;
            var params = Object.assign({}, firstResult.params);
            var query = querystring.parse(uri.query, handler.queryDelimiter, handler.queryEquals);
            var idFriendlyPath = uri.path.replace(/\//g, '_');
            if(idFriendlyPath.startsWith('_')){
                idFriendlyPath = idFriendlyPath.substr(1);
            }

            Object.assign(params, { query: query, path: idFriendlyPath });

            console.log('Route Match, \n\tURL:', uriString, '\n\tMatch:', handler.name, '\n\tParams:', params); 

            var routeMatch = new RouteMatch(handler, params);

            routeMatch.getResults().then(() => {
                resolve(routeMatch.toJSON());
            }).catch((err) => {
                reject(err);  
            });
        });
    }
}
