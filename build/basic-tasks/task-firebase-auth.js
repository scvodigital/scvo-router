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
const dot = require("dot-object");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskFirebaseAuth extends task_base_1.TaskBase {
    constructor(apps) {
        super();
        this.apps = apps;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = routeTaskConfig.config;
            const appName = routeMatch.getString(config.appName);
            if (!this.apps.hasOwnProperty(appName)) {
                throw new Error('No Firebase app named "' + appName + '" registered');
            }
            const idToken = dot.pick(config.tokenPath, routeMatch);
            if (!idToken && config.noTokenRoute) {
                return {
                    command: task_base_1.TaskResultCommand.REROUTE,
                    routeName: config.noTokenRoute
                };
            }
            else if (!idToken) {
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            const app = this.apps[appName];
            const decodedToken = yield app.auth().verifyIdToken(idToken);
            if (!decodedToken && config.notAuthenticatedRoute) {
                return {
                    command: task_base_1.TaskResultCommand.REROUTE,
                    routeName: config.notAuthenticatedRoute
                };
            }
            else if (!decodedToken) {
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            const user = yield app.auth().getUser(decodedToken.uid);
            if (!user) {
                throw new Error('Failed to get user with ID "' + decodedToken.uid + '"');
            }
            routeMatch.data[routeTaskConfig.name] = user;
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseAuth = TaskFirebaseAuth;
/* tslint:enable:no-any */
//# sourceMappingURL=task-firebase-auth.js.map