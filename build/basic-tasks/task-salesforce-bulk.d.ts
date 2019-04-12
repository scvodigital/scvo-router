import * as jsforce from 'jsforce';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskSalesforceBulk extends TaskBase {
    private connections;
    constructor(connections: {
        [name: string]: SFAuthDetails;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskSalesforceBulkConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    executeBatch(records: any[], config: TaskSalesforceBulkConfiguration, sfClient: jsforce.Connection, routeMatch: RouteMatch): Promise<any>;
}
export interface TaskSalesforceBulkConfiguration {
    connection: string;
    recordsTemplate: string;
    bulkOptions: jsforce.BulkOptions;
    pageSize: number;
    type: string;
    operation: string;
}
export interface SFAuthDetails {
    username: string;
    password: string;
    loginUrl: string;
}
export declare class BatchError extends Error {
    operationErrors: any[];
    constructor(message: string, operationErrors: any[]);
}
