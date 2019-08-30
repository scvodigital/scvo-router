import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskSalesforceApex extends TaskBase {
    private connections;
    constructor(connections: {
        [name: string]: SFApexAuthDetails;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskSalesforceApexConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface SFApexAuthDetails {
    username: string;
    password: string;
    loginUrl: string;
}
export interface TaskSalesforceApexConfiguration {
    connection: string;
    method: string;
    apexClassPath: string;
    body: any;
    output: string;
}
