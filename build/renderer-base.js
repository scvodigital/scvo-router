"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
var RendererBase = /** @class */ (function () {
    function RendererBase() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }
    RendererBase.prototype.render = function (template, data) {
        throw new Error('Not yet implemented');
    };
    RendererBase.prototype.renderSync = function (template, data) {
        throw new Error('Not yet implemented');
    };
    return RendererBase;
}());
exports.RendererBase = RendererBase;
/* tslint:enable:no-any */ 
//# sourceMappingURL=renderer-base.js.map