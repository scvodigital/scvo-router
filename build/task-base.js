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
class TaskBase {
    constructor(...args) { }
    execute(routeMatch, config, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not yet implemented');
        });
    }
}
exports.TaskBase = TaskBase;
var TaskResultCommand;
(function (TaskResultCommand) {
    TaskResultCommand[TaskResultCommand["CONTINUE"] = 0] = "CONTINUE";
    TaskResultCommand[TaskResultCommand["HALT"] = 1] = "HALT";
    TaskResultCommand[TaskResultCommand["REROUTE"] = 2] = "REROUTE";
})(TaskResultCommand = exports.TaskResultCommand || (exports.TaskResultCommand = {}));
/* tslint:enable:no-any */
//# sourceMappingURL=task-base.js.map