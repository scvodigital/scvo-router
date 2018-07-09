import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskTransform extends TaskBase {
    parsers: {
        querystring: any;
        url: any;
    };
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<any>): Promise<TaskResult>;
}
export interface TaskTransformConfiguration {
    map: any[] | any;
}
