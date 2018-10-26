/* tslint:disable:no-any */
import {RendererBase} from './renderer-base';
const jsone: any = require('json-e');

export class RendererJsone extends RendererBase {
  constructor(private helpers: FunctionMap = {}) {
    super();
  }
  async render(template: any, data: any): Promise<any> {
    if (typeof template !== 'object') {
      throw new Error('A JSON-e renderer may only be passed a JSON object');
    }
    if (!data.jsone) {
      data.jsone = this.helpers;
    }
    const output = jsone(template, data);
    return output;
  }

  renderSync(template: any, data: any): any {
    if (typeof template !== 'object') {
      throw new Error('A JSON-e renderer may only be passed a JSON object');
    }
    if (!data.jsone) {
      data.jsone = this.helpers;
    }
    const output = jsone(template, data);
    return output;
  }
}

export interface FunctionMap {
  [name: string]: (...args: any[]) => any;
}
/* tslint:enable:no-any */