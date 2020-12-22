import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskCacheFlush extends TaskBase {
    constructor();
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskCacheFlushConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskCacheFlushConfiguration {
    partition: string;
}
