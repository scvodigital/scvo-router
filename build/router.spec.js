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
require("mocha");
const handlebars = require("handlebars");
const renderer_handlebars_1 = require("./renderer-handlebars");
const task_render_layout_1 = require("./basic-tasks/task-render-layout");
const task_request_1 = require("./basic-tasks/task-request");
/* tslint:disable */
describe('Constructor', () => {
    it('should initialize a new Router instance', () => __awaiter(this, void 0, void 0, function* () {
        const taskModules = {
            layoutRender: new task_render_layout_1.TaskRenderLayout(),
            request: new task_request_1.TaskRequest()
        };
        const renderers = { handlebars: new renderer_handlebars_1.RendererHandlebars(handlebars) };
        //    const router = new Router(TestSite, taskModules, renderers);
        //    const response = await router.go(TestGetIndexRequest);
        //    console.log(response);
    }));
});
/* tslint:enable */
//# sourceMappingURL=router.spec.js.map