import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskRenderLayout extends TaskBase {
    constructor(jsonLogicOperations?: JsonLogicOperationsMap);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskRenderLayoutConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    private getTemplate(pathOrTemplate, routeMatch);
}
export interface TaskRenderLayoutConfiguration {
    logic: any;
    layouts: LayoutMap;
    output: 'data' | 'body';
}
export interface LayoutMap {
    [name: string]: LayoutConfiguration;
}
export interface LayoutConfiguration {
    parts: LayoutPartMap;
    layout: string;
    contentType?: string;
}
export interface LayoutPartMap {
    [name: string]: string;
}
export interface LayoutPartsOutputMap {
    [partName: string]: string;
}
export interface JsonLogicOperationsMap {
    [name: string]: (...args: any[]) => any;
}
