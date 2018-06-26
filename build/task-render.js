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
const task_base_1 = require("./task-base");
class TaskRender extends task_base_1.TaskBase {
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const rendered = yield renderer.render(config.template, routeMatch);
            if (config.output === 'data') {
                routeMatch.data[routeTaskConfig.name] = rendered;
            }
            else if (config.output === 'body') {
                routeMatch.response.body = rendered;
            }
            else {
                throw new Error('No output specified');
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskRender = TaskRender;
//# sourceMappingURL=task-render.js.map