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
            let cookie = dot.pick(config.cookiePath, routeMatch);
            const idToken = dot.pick(config.tokenPath, routeMatch);
            if (!idToken && !cookie && config.noTokenRoute) {
                return {
                    command: task_base_1.TaskResultCommand.REROUTE,
                    routeName: config.noTokenRoute
                };
            }
            else if (!idToken) {
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            const app = this.apps[appName];
            let decodedToken;
            if (cookie) {
                try {
                    routeMatch.log('Got Cookie:', cookie);
                    decodedToken = yield app.auth().verifySessionCookie(cookie);
                    routeMatch.log('Decoded Cookie:', decodedToken);
                }
                catch (err) {
                }
            }
            else {
                try {
                    routeMatch.log('Got Token but no Cookie:', idToken);
                    decodedToken = yield app.auth().verifyIdToken(idToken);
                    routeMatch.log('Decoded Token:', decodedToken);
                    if (decodedToken) {
                        routeMatch.log('Exchangin token for 2 week cookie');
                        cookie = yield app.auth().createSessionCookie(idToken, { expiresIn: 1209600000 });
                        routeMatch.log('Got the Cookie!:', cookie, '\nStoring it here:', config.cookiePath);
                        dot.set(config.cookiePath, cookie, routeMatch);
                    }
                }
                catch (err) {
                }
            }
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