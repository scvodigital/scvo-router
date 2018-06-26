import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskRedirect extends TaskBase {
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskRedirectConfiguration>): Promise<TaskResult>;
}
export interface TaskRedirectConfiguration {
    location: string;
    statusCode?: 301 | 303 | 307;
}
