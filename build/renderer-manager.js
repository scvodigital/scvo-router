"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RendererManager {
    constructor(rendererMap) {
        this.rendererMap = rendererMap;
    }
    getRenderer(rendererName) {
        if (!this.hasRenderFunction(rendererName)) {
            throw new Error('No Renderer named "' + rendererName + '" loaded');
        }
        const renderer = this.rendererMap[rendererName];
        return renderer;
    }
    hasRenderFunction(rendererName) {
        return this.rendererMap.hasOwnProperty(rendererName);
    }
}
exports.RendererManager = RendererManager;
//# sourceMappingURL=renderer-manager.js.map