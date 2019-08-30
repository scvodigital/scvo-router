"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsforce = __importStar(require("jsforce"));
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskSalesforceApex extends task_base_1.TaskBase {
    constructor(connections) {
        super();
        this.connections = connections;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = routeTaskConfig.config;
            const connection = this.connections[config.connection];
            routeMatch.log('Creating Salesforce client and logging in', connection);
            const sfClient = new jsforce.Connection({ loginUrl: connection.loginUrl });
            const loginResponse = yield sfClient.login(connection.username, connection.password);
            routeMatch.log('Salesforce login response:', loginResponse);
            let body;
            if (config.body) {
                body = routeMatch.getObject(config.body);
                if (typeof body === 'string') {
                    body = yield renderer.render(body, routeMatch);
                    body = JSON.parse(body);
                }
            }
            let apexClassPath;
            apexClassPath = routeMatch.getObject(config.apexClassPath);
            apexClassPath =
                yield renderer.render(apexClassPath, routeMatch);
            const method = config.method.toLowerCase();
            routeMatch.log('Requesting Apex Class:', apexClassPath, '| method', config.method, '| body:', body);
            let output;
            // All methods seem have the same signature
            output = yield sfClient.apex[method](apexClassPath, body);
            if (config.output === 'data') {
                routeMatch.data[routeTaskConfig.name] = output;
            }
            else if (config.output === 'body') {
                routeMatch.response.body = output;
            }
            else {
                throw new Error('No output specified');
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskSalesforceApex = TaskSalesforceApex;
//# sourceMappingURL=task-salesforce-apex.js.map