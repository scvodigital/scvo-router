import * as handlebars from 'handlebars';

import {RendererBase} from './renderer-base';

/* tslint:disable:no-any */
export class RendererHandlebars extends RendererBase {
  constructor(private hbs: typeof handlebars) {
    super();
  }
  async render(template: any, data: any): Promise<string> {
    if (typeof template !== 'string') {
      throw new Error('A handlebars renderer may only be passed a string');
    }
    const compiler = this.hbs.compile(template as string);
    const output = compiler(data);
    return output;
  }

  renderSync(template: any, data: any): any {
    if (typeof template !== 'string') {
      throw new Error('A handlebars renderer may only be passed a string');
    }
    const compiler = this.hbs.compile(template as string);
    const output = compiler(data);
    return output;
  }
}
/* tslint:enable:no-any */