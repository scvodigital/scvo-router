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
const Mailgun = require("mailgun-js");
const mailComposer = require('nodemailer/lib/mail-composer');
const task_base_1 = require("../task-base");
class TaskMailgun extends task_base_1.TaskBase {
    constructor(connectionConfigs) {
        super();
        this.connections = {};
        const connectionNames = Object.keys(connectionConfigs);
        connectionNames.forEach((connectionName) => {
            const connectionConfig = connectionConfigs[connectionName];
            this.connections[connectionName] = new Mailgun(connectionConfig);
        });
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
            const report = [];
            const promises = [];
            for (let i = 0; i < dataArray.length; ++i) {
                const data = dataArray[i];
                if (!data)
                    continue;
                promises.push(this.sendEmail(data));
            }
            const responses = yield Promise.all(promises);
            routeMatch.setData(responses);
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    sendEmail(data) {
        return new Promise((resolve, reject) => {
            const emailer = this.connections[data.connectionName];
            const mail = new mailComposer(data);
            mail.compile().build((err, message) => {
                if (data.html)
                    delete data.html;
                if (data.text)
                    delete data.text;
                if (err) {
                    return resolve({ data, response: err });
                }
                data.message = message.toString('ascii');
                emailer.messages().sendMime(data, (err, body) => {
                    data.message = data.message.substr(0, 255);
                    if (err) {
                        resolve({ data, response: err });
                    }
                    else {
                        resolve({ data, response: body });
                    }
                });
            });
        });
    }
}
exports.TaskMailgun = TaskMailgun;
/* tslint:enable:no-any */
//# sourceMappingURL=task-mailgun.js.map