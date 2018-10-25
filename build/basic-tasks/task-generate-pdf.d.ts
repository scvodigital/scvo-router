/// <reference types="node" />
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RouteMatch } from '../route-match';
import { RendererBase } from '../renderer-base';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskGeneratePdf extends TaskBase {
    private fonts;
    printer: any;
    constructor(fonts: any);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskGeneratePdfConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    fetchImages(images: ImageMap | undefined, routeMatch: RouteMatch): Promise<ImageMap>;
    generatePdf(definition: any, routeMatch: RouteMatch): Promise<Buffer>;
}
export interface TaskGeneratePdfConfiguration {
    images?: ImageMap;
    headerTemplate?: any;
    footerTemplate?: any;
    definitionTemplate: any;
}
export interface ImageMap {
    [name: string]: string;
}
