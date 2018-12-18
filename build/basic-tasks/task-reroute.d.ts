import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
import { RendererBase } from '../renderer-base';
export declare class TaskReroute extends TaskBase {
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<any>, renderer?: RendererBase): Promise<TaskResult>;
}
