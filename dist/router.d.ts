import { SearchResponse } from 'elasticsearch';
import { IRoutes, IRouteMatch } from './interfaces';
/** Class for managing incoming requests, routing them to Elasticsearch queries, and rendering output */
export declare class Router {
    private routes;
    private uaId;
    private uaUid;
    private routeRecognizer;
    private defaultResult;
    private _visitor;
    private readonly visitor;
    /**
     * Create a Router for matching routes and rendering responses
     * @param {IRoutes} routes The routes and their configurations we are matching against
     */
    constructor(routes: IRoutes, uaId?: string, uaUid?: string);
    generateUrl(routeName: string, params: any): any;
    /**
     * Execute the route against a URI to get a matched route and rendered responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    execute(uriString: string): Promise<IRouteMatch>;
    trackRoute(path: string): void;
    trackDocumentHit(results: SearchResponse<any>): void;
}
