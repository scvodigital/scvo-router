import * as gapis from 'googleapis';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskGAGet extends TaskBase {
    private connections;
    constructor(connections: {
        [name: string]: GAAuthDetails;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskGAGetConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    getData(params: gapis.analytics_v3.Params$Resource$Data$Ga$Get, options: any): Promise<any[]>;
}
export interface TaskGAGetConfiguration {
    connection: string;
    parameters: gapis.analytics_v3.Params$Resource$Data$Ga$Get;
}
export interface GAAuthDetails {
    clientEmail: string;
    privateKey: string;
}
