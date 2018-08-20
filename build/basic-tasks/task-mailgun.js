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
const Mailgun = require("mailgun-js");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskRender extends task_base_1.TaskBase {
    constructor(connectionConfigs) {
        super();
        this.connectionConfigs = connectionConfigs;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const template = routeMatch.getString(config.template);
            const dataJson = yield renderer.render(template, routeMatch);
            const dataParsed = JSON.parse(dataJson);
            const dataArray = Array.isArray(dataParsed) ? dataParsed : [dataParsed];
            const connectionConfig = this.connectionConfigs[config.connectionName];
            const mailer = new Mailgun(connectionConfig);
            const report = [];
            for (let i = 0; i < dataArray.length; ++i) {
                const data = dataArray[i];
                try {
                    const response = yield this.sendEmail(mailer, data);
                    routeMatch.log('Send email call successful', data.to, response);
                    report.push({ data, response });
                }
                catch (err) {
                    console.error('Failed to sent:', data, err);
                    report.push({ data, response: err });
                    routeMatch.error(err);
                }
            }
            routeMatch.setData(report);
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    sendEmail(mailer, data) {
        return new Promise((resolve, reject) => {
            mailer.messages().send(data, (err, body) => {
                if (err)
                    return reject(err);
                return resolve(body);
            });
        });
    }
}
exports.TaskRender = TaskRender;
//# sourceMappingURL=task-mailgun.js.map