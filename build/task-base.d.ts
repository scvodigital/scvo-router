import { RendererBase } from './renderer-base';
import { RouteMatch } from './route-match';
export declare class TaskBase {
    constructor(...args: any[]);
    execute(routeMatch: RouteMatch, config: any, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskResult {
    command: TaskResultCommand;
    routeName?: string;
}
export declare enum TaskResultCommand {
    CONTINUE = 0,
    HALT = 1,
    REROUTE = 2,
}
