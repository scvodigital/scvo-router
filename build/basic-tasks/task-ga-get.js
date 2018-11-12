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
const googleapis_1 = require("googleapis");
const task_base_1 = require("../task-base");
const analytics = googleapis_1.google.analytics('v3');
/* tslint:disable:no-any */
class TaskGAGet extends task_base_1.TaskBase {
    constructor(connections) {
        super();
        this.connections = connections;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const connection = this.connections[config.connection];
            routeMatch.log('Setting up new JWT Client');
            const scope = ['https://www.googleapis.com/auth/analytics.readonly'];
            const jwtClient = new googleapis_1.google.auth.JWT(connection.clientEmail, undefined, connection.privateKey, scope, undefined);
            routeMatch.log('Authorising JWT Client');
            const credentials = yield jwtClient.authorize();
            routeMatch.log('Setting credentials', credentials);
            jwtClient.setCredentials(credentials);
            googleapis_1.google.options({ auth: jwtClient });
            let parameters;
            if (typeof config.parameters === 'string') {
                routeMatch.log('Template passed as a template so rendering it');
                const template = routeMatch.getString(config.parameters);
                const rendered = yield renderer.render(template, routeMatch);
                if (typeof rendered === 'string') {
                    routeMatch.log('Renderer responsed with string so parsing it');
                    parameters = JSON.parse(rendered);
                }
                else {
                    parameters = rendered;
                }
            }
            else {
                parameters = config.parameters;
            }
            routeMatch.log('Parameters have been compiled into the following:', parameters);
            const options = { auth: jwtClient };
            routeMatch.log('Getting data using connection details:', options);
            const rows = yield this.getData(parameters, options);
            routeMatch.log('Got data.', rows.length, 'rows');
            routeMatch.setData(rows);
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    getData(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = params.hasOwnProperty('start-index') ? params['start-index'] || 0 : 0;
            const res = yield analytics.data.ga.get(params, options);
            if (!res || !res.data || !res.data.rows)
                return [];
            const rows = res.data.rows || [];
            const totalResults = res.data.totalResults || 0;
            if (startIndex + rows.length < totalResults) {
                params['start-index'] = startIndex + rows.length;
                const nextPage = yield this.getData(params, options);
                rows.push(...nextPage);
            }
            return rows;
        });
    }
}
exports.TaskGAGet = TaskGAGet;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-ga-get.js.map