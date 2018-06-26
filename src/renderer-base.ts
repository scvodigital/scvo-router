/* tslint:disable:no-any */
export class RendererBase {
  constructor(...args: any[]) {}
  render(template: string, data: any): Promise<string> {
    throw new Error('Not yet implemented');
  }
}
/* tslint:enable:no-any */
