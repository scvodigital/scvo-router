/// <reference types="handlebars" />
import { RendererBase } from './renderer-base';
import handlebars = require('handlebars');
export declare class RendererHandlebars extends RendererBase {
    private hbs;
    constructor(hbs: typeof handlebars);
    render(template: string, data: any): Promise<string>;
}
