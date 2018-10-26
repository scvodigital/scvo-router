import { RendererBase } from './renderer-base';
export declare class RendererJsone extends RendererBase {
    private helpers;
    constructor(helpers?: FunctionMap);
    render(template: any, data: any): Promise<any>;
    renderSync(template: any, data: any): any;
}
export interface FunctionMap {
    [name: string]: (...args: any[]) => any;
}
