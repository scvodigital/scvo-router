import { IRoutes } from './interfaces';
import { RouteMatch } from './route-match';
/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
export declare class Router {
    private routes;
    private routeRecognizer;
    private defaultResult;
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    constructor(routes: IRoutes);
    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    execute(uriString: string): Promise<RouteMatch>;
}
