"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
const renderer_base_1 = require("./renderer-base");
const jsone = require('json-e');
class RendererJsone extends renderer_base_1.RendererBase {
    constructor() {
        super();
    }
    render(template, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof template !== 'object') {
                throw new Error('A JSON-e renderer may only be passed a JSON object');
            }
            const output = jsone(template, data);
            return output;
        });
    }
}
exports.RendererJsone = RendererJsone;
/* tslint:enable:no-any */ 
//# sourceMappingURL=renderer-jsone.js.map