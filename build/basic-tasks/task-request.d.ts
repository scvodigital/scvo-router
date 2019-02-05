/// <reference types="request-promise-native" />
import request = require('request-promise-native');
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
import { RendererBase } from '../renderer-base';
export declare class TaskRequest extends TaskBase {
    private secrets;
    constructor(secrets?: any);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskRequestConfiguration | TaskRequestTemplatedConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    getTemplateOptions(routeMatch: RouteMatch, config: any, renderer?: RendererBase): Promise<request.Options>;
}
export interface TaskRequestTemplatedConfiguration {
    optionsTemplates: {
        [key: string]: any;
    } | string;
}
export interface TaskRequestConfiguration {
    options: {
        [key: string]: request.Options | string;
    } | string;
}
