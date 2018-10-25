/* tslint:disable:no-any */
import {RendererBase} from './renderer-base';
const jsone: any = require('json-e');

export class RendererJsone extends RendererBase {
  constructor() {
    super();
  }
  async render(template: any, data: any): Promise<any> {
    if (typeof template !== 'object') {
      throw new Error('A JSON-e renderer may only be passed a JSON object');
    }
    const output = jsone(template, data);
    return output;
  }
}
/* tslint:enable:no-any */