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
            const optionsMap = {};
            if (routeTaskConfig.config.hasOwnProperty('optionsTemplates')) {
                config = routeTaskConfig.config;
                for (const name of Object.keys(config.optionsTemplates)) {
                    const optionsTemplate = config.optionsTemplates[name];
                    optionsMap[name] = yield this.getTemplateOptions(routeMatch, optionsTemplate, renderer);
                }
            }
            else {
                config = routeTaskConfig.config;
                const resolvedOptions = routeMatch.getObject(config.options);
                for (const name of Object.keys(resolvedOptions)) {
                    const options = resolvedOptions[name];
                    optionsMap[name] = routeMatch.getObject(options);
                }
            }
            const outputs = {};
            for (const name of Object.keys(optionsMap)) {
                const options = optionsMap[name];
                routeMatch.log('Requesting', options);
                const output = yield request(options);
                outputs[name] = output;
            }
            routeMatch.setData(outputs);
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    getTemplateOptions(routeMatch, config, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const optionsTemplate = routeMatch.getObject(config);
            routeMatch.secrets = this.secrets;
            const optionsString = yield renderer.render(optionsTemplate, routeMatch);
            delete routeMatch.secrets;
            routeMatch.log('optionsString is: ', optionsString);
            const options = typeof optionsString === 'string' ?
                JSON.parse(optionsString) :
                optionsString;
            return options;
        });
    }
}
exports.TaskRequest = TaskRequest;
//# sourceMappingURL=task-request.js.map