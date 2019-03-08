/// <reference types="handlebars" />
import { RendererBase } from './renderer-base';
import handlebars = require('handlebars');
export declare class RendererHandlebars extends RendererBase {
    private hbs;
    constructor(hbs: typeof handlebars);
    render(template: any, data: any): Promise<string>;
    renderSync(template: any, data: any): any;
}
