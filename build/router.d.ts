import { MenuDictionary, RouteMap, RouterConfiguration, RouterDestinationMap, RouterRequest, RouterResponse, RouterTaskMap } from './interfaces';
import { RouterDestination } from './router-destination';
import { RouterTask } from './router-task';
/**
 * Class for managing incoming requests, routing them to Elasticsearch queries,
 * and rendering output
 */
export declare class Router implements RouterConfiguration {
    private context;
    name: string;
    domains: string[];
    metaData: {};
    menus: MenuDictionary;
    routes: RouteMap;
    uaId: string;
    routerTasks: RouterTaskMap;
    routerDestinations: RouterDestinationMap;
    private routeRecognizer;
    private defaultResult;
    /**
     * Create a Router for matching routes and rendering responses
     * @param {RouteMap} routes The routes and their configurations we are matching against
     */
    constructor(context: RouterConfiguration, routerTasks: RouterTask[], routerDestinations: RouterDestination[]);
    /**
     * Execute the route against a URI to get a matched route and rendered
     * responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    execute(request: RouterRequest): Promise<RouterResponse>;
    private matchRoute(request);
    private executeRoute(routeMatch);
}
