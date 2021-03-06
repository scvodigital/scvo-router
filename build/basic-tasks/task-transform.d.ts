import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskTransform extends TaskBase {
    private parsers;
    constructor(parsers: any);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<any>): Promise<TaskResult>;
}
export interface TaskTransformConfiguration {
    map: any[] | any;
}
