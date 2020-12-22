/// <reference types="universal-analytics" />
import * as ua from 'universal-analytics';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskGASet extends TaskBase {
    constructor();
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskGASetConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    getObjectOrTemplate<T>(obj: T | undefined, template: any | undefined, renderer: RendererBase, routeMatch: RouteMatch): Promise<T | undefined>;
}
export interface TaskGASetConfiguration {
    options?: ua.VisitorOptions;
    optionsTemplate?: any;
    actions: Array<{
        action: 'pageview' | 'screenview' | 'event';
        template?: any;
        parameters?: ua.PageviewParams | ua.ScreenviewParams | ua.EventParams;
    }>;
}
export interface GASetOutput {
    visitor: ua.VisitorOptions;
    actions: Array<{
        action: 'pageview' | 'screenview' | 'event';
        params: ua.PageviewParams | ua.ScreenviewParams | ua.EventParams | undefined;
    }>;
}
