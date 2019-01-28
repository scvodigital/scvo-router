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
const request = require("request-promise-native");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskRequest extends task_base_1.TaskBase {
    constructor(secrets = {}) {
        super();
        this.secrets = secrets;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            let config;
            let options;
            if (routeTaskConfig.config.hasOwnProperty('optionsTemplate')) {
                config = routeTaskConfig.config;
                options = yield this.getTemplateOptions(routeMatch, config, renderer);
            }
            else {
                config = routeTaskConfig.config;
                options = config.options;
            }
            const output = yield request(options);
            routeMatch.data[routeTaskConfig.name] = output;
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    getTemplateOptions(routeMatch, config, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            routeMatch.secrets = this.secrets;
            const optionsString = yield renderer.render(config.optionsTemplate, routeMatch);
            delete routeMatch.secrets;
            const options = typeof optionsString === 'string' ?
                JSON.parse(optionsString) :
                optionsString;
            return options;
        });
    }
}
exports.TaskRequest = TaskRequest;
//# sourceMappingURL=task-request.js.map