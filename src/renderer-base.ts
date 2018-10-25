/* tslint:disable:no-any */
export class RendererBase {
  constructor(...args: any[]) {}
  render(template: any, data: any): Promise<any> {
    throw new Error('Not yet implemented');
  }
}
/* tslint:enable:no-any */