"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RendererManager = /** @class */ (function () {
    function RendererManager(rendererMap) {
        this.rendererMap = rendererMap;
    }
    RendererManager.prototype.getRenderer = function (rendererName) {
        if (!this.hasRenderFunction(rendererName)) {
            throw new Error('No Renderer named "' + rendererName + '" loaded');
        }
        var renderer = this.rendererMap[rendererName];
        return renderer;
    };
    RendererManager.prototype.hasRenderFunction = function (rendererName) {
        return this.rendererMap.hasOwnProperty(rendererName);
    };
    return RendererManager;
}());
exports.RendererManager = RendererManager;
//# sourceMappingURL=renderer-manager.js.map