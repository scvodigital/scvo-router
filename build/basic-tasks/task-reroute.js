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
const jsonLogic = require("json-logic-js");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskReroute extends task_base_1.TaskBase {
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = routeTaskConfig.config;
            const routeName = jsonLogic.apply(config, routeMatch);
            if (routeName) {
                return { command: task_base_1.TaskResultCommand.REROUTE, routeName };
            }
            else {
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
        });
    }
}
exports.TaskReroute = TaskReroute;
//# sourceMappingURL=task-reroute.js.map