import { RouteConfiguration, RouterConfiguration, RouterRequest, RouterResponse } from './configuration-interfaces';
import { MatchedRoute, RegisteredRoute } from './registered-route';
import { RendererManager, RendererMap } from './renderer-manager';
import { TaskModuleManager, TaskModuleMap } from './task-module-manager';
import { CacheManager } from './cache-manager';
export declare class Router {
    private context;
    private rendererMap;
    registeredRoutes: RegisteredRoute[];
    defaultRoute: RouteConfiguration;
    taskModuleManager: TaskModuleManager;
    rendererManager: RendererManager;
    cacheManager: CacheManager;
    checkResponses: RouterConfigurationCheckResponse[];
    readonly hasErrors: boolean;
    constructor(context: RouterConfiguration, taskModuleMap: TaskModuleMap, rendererMap: RendererMap);
    checkConfiguration(): void;
    go(request: RouterRequest): Promise<RouterResponse>;
    matchRoute(request: RouterRequest): MatchedRoute;
}
export interface RouterConfigurationCheckResponse {
    source: RouterConfigurationCheckResponseSource;
    level: RouterConfigurationCheckResponseLevel;
    location: string;
    error: string;
    solution?: string;
}
export declare enum RouterConfigurationCheckResponseSource {
    ROUTER_CONFIGURATION = 0,
    ROUTE_CONFIGURATION = 1,
    ROUTE_TASK_CONFIGURATION = 2,
    RENDERER = 3,
    TASK_MODULE = 4,
}
export declare enum RouterConfigurationCheckResponseLevel {
    INFO = 0,
    WARNING = 1,
    ERROR = 2,
}
