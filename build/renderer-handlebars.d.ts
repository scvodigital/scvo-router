import * as handlebars from 'handlebars';
import { RendererBase } from './renderer-base';
export declare class RendererHandlebars extends RendererBase {
    private hbs;
    constructor(hbs: typeof handlebars);
    render(template: any, data: any): Promise<string>;
    renderSync(template: any, data: any): any;
}
