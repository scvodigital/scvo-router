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
class TaskRedirect extends task_base_1.TaskBase {
    execute(routeMatch, routeTaskConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = routeTaskConfig.config;
            routeMatch.response.headers.location = config.location;
            routeMatch.response.statusCode = config.statusCode || 301;
            return { command: task_base_1.TaskResultCommand.HALT };
        });
    }
}
exports.TaskRedirect = TaskRedirect;
//# sourceMappingURL=task-redirect.js.map