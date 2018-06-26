import { RendererBase } from './renderer-base';
export declare class RendererManager {
    private rendererMap;
    constructor(rendererMap: RendererMap);
    getRenderer(rendererName: string): RendererBase;
    hasRenderFunction(rendererName: string): boolean;
}
export interface RendererMap {
    [name: string]: RendererBase;
}
