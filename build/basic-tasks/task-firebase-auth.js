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
            const cookie = routeMatch.request.cookies[config.cookieName];
            routeMatch.log('Config', config);
            if (!cookie) {
                return this.getNoAuthReturn(routeMatch, config, 'No Cookie found or provided');
            }
            const app = this.apps[appName];
            let uid = '';
            try {
                routeMatch.log('Got Cookie:', cookie, 'Verifying...');
                const decodedToken = yield app.auth().verifySessionCookie(cookie);
                if (!decodedToken) {
                    throw new Error('No Decoded Token after verifying Session Cookie');
                }
                routeMatch.log('Decoded Cookie:', decodedToken);
                uid = decodedToken.uid;
            }
            catch (err) {
                routeMatch.log('Failed to verify session cookie:', err);
                return this.getNoAuthReturn(routeMatch, config, 'Failed to verify session cookie');
            }
            try {
                routeMatch.log('Getting user for User Id', uid);
                const user = yield app.auth().getUser(uid);
                if (!user) {
                    throw new Error('Failed to get user with ID "' + uid + '"');
                }
                routeMatch.log('Got user', user);
                routeMatch.setData(user);
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            catch (err) {
                routeMatch.log('Failed to get user:', err);
                return this.getNoAuthReturn(routeMatch, config, 'Failed to get user for User Id', uid);
            }
        });
    }
    getNoAuthReturn(routeMatch, config, ...args) {
        if (config.notAuthenticatedRoute) {
            routeMatch.log(...args, 'Has notAuthenticatedRoute so returning REROUTE command', config.notAuthenticatedRoute);
            return {
                command: task_base_1.TaskResultCommand.REROUTE,
                routeName: config.notAuthenticatedRoute
            };
        }
        else {
            routeMatch.log(...args, 'No notAuthenticatedRoute to returning CONTINUE command');
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        }
    }
}
exports.TaskFirebaseAuth = TaskFirebaseAuth;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-firebase-auth.js.map