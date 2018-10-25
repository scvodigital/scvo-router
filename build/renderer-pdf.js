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
const renderer_base_1 = require("./renderer-base");
/* tslint:disable:no-any */
class RendererHandlebars extends renderer_base_1.RendererBase {
    constructor(hbs) {
        super();
        this.hbs = hbs;
    }
    render(template, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const compiler = this.hbs.compile(template);
            const output = compiler(data);
            return output;
        });
    }
}
exports.RendererHandlebars = RendererHandlebars;
/* tslint:enable:no-any */
//# sourceMappingURL=renderer-pdf.js.map