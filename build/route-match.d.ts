import { RouteConfiguration, RouterConfiguration, RouterRequest, RouterResponse, RouteTaskConfiguration } from './configuration-interfaces';
import { MatchedRoute } from './registered-route';
import { RendererManager } from './renderer-manager';
import { TaskBase } from './task-base';
import { TaskModuleManager } from './task-module-manager';
export declare class RouteMatch {
    request: RouterRequest;
    context: RouterConfiguration;
    private taskModuleManager;
    private rendererManager;
    route: RouteConfiguration;
    data: any;
    response: RouterResponse;
    errors: TaskError[];
    logs: string[];
    currentTask: RouteTaskConfiguration<any> | null;
    currentTaskIndex: number;
    reroutes: RouteConfiguration[];
    private readonly dp;
    constructor(matchedRoute: MatchedRoute, request: RouterRequest, context: RouterConfiguration, taskModuleManager: TaskModuleManager, rendererManager: RendererManager);
    execute(): Promise<RouterResponse>;
    private reroute(routeName);
    private mergeParams(matchedParams);
    getString(pathOrVal: string): string;
    setData(data: any): void;
    log(...args: any[]): void;
    error(error: Error, message?: string): void;
}
export interface TaskModuleMap {
    [name: string]: TaskBase;
}
export interface TaskError {
    timestamp: Date;
    routeName: string;
    taskName: string;
    taskIndex: number;
    error: Error;
    message: string;
}
