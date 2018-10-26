export declare class RendererBase {
    constructor(...args: any[]);
    render(template: any, data: any): Promise<any>;
    renderSync(template: any, data: any): Promise<any>;
}
