import {RendererBase} from './renderer-base';
import handlebars = require('handlebars');

/* tslint:disable:no-any */
export class RendererHandlebars extends RendererBase {
  constructor(private hbs: typeof handlebars) {
    super();
  }
  async render(template: string, data: any): Promise<string> {
    const compiler = this.hbs.compile(template);
    const output = compiler(data);
    return output;
  }
}
/* tslint:enable:no-any */
