export declare class RendererBase {
    constructor(...args: any[]);
    render(template: string, data: any): Promise<string>;
}
