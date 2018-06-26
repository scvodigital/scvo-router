import {RendererBase} from './renderer-base';

export class RendererManager {
  constructor(private rendererMap: RendererMap) {}
  getRenderer(rendererName: string): RendererBase {
    if (!this.hasRenderFunction(rendererName)) {
      throw new Error('No Renderer named "' + rendererName + '" loaded');
    }
    const renderer = this.rendererMap[rendererName];
    return renderer;
  }
  hasRenderFunction(rendererName: string): boolean {
    return this.rendererMap.hasOwnProperty(rendererName);
  }
}

export interface RendererMap {
  [name: string]: RendererBase;
}
