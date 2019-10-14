import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskCacheSet extends TaskBase {
    constructor();
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskCacheSetConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskCacheSetConfiguration {
    namespace: string;
    paths: string[];
    key: string;
}
