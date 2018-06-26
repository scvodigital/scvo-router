import mysql = require('mysql');
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskMySQL extends TaskBase {
    private connectionConfigs;
    constructor(connectionConfigs: ConnectionMap);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskMySQLConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    executeQuery(routeMatch: RouteMatch, connection: mysql.Connection, queryTemplate: string, renderer: RendererBase): Promise<any>;
}
export interface ConnectionMap {
    [name: string]: mysql.ConnectionConfig;
}
export interface TaskMySQLConfiguration {
    connectionName: string;
    queryTemplates: {
        [name: string]: string;
    };
}
