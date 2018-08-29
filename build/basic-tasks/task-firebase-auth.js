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
            let cookie = routeMatch.request.cookies[config.cookieName];
            const idToken = dot.pick(config.tokenPath, routeMatch);
            if (!idToken && !cookie && config.noTokenRoute) {
                routeMatch.log('No ID Token or Cookie and a "noTokenRoute" has been provided. Returning REROUTE command:', config.noTokenRoute);
                return {
                    command: task_base_1.TaskResultCommand.REROUTE,
                    routeName: config.noTokenRoute
                };
            }
            else if (!idToken) {
                routeMatch.log('No ID Token. Returning CONTINUE command');
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            const app = this.apps[appName];
            let decodedToken;
            if (cookie) {
                try {
                    routeMatch.log('Got Cookie:', cookie, 'Verifying...');
                    decodedToken = yield app.auth().verifySessionCookie(cookie);
                    routeMatch.log('Decoded Cookie:', decodedToken);
                }
                catch (err) {
                    console.error('Failed to verify session cookie:', err);
                }
            }
            else {
                try {
                    routeMatch.log('Got Token but no Cookie:', idToken, 'Verifying...');
                    decodedToken = yield app.auth().verifyIdToken(idToken);
                    routeMatch.log('Decoded Token:', decodedToken);
                    if (decodedToken) {
                        routeMatch.log('Exchangin token for 2 week cookie');
                        cookie = yield app.auth().createSessionCookie(idToken, { expiresIn: 1209600000 });
                        routeMatch.log('Got the Cookie!:', cookie, '\nStoring it here:', config.cookieName);
                        const cookieObj = { value: cookie, options: config.cookieOptions };
                        routeMatch.response.cookies[config.cookieName] = cookieObj;
                    }
                }
                catch (err) {
                    routeMatch.error(err);
                }
            }
            if (!decodedToken && config.notAuthenticatedRoute) {
                routeMatch.log('No decoded token so assuming not authenticated. "notAuthenticatedRoute" provided. Returning REROUTE command:', config.notAuthenticatedRoute);
                return {
                    command: task_base_1.TaskResultCommand.REROUTE,
                    routeName: config.notAuthenticatedRoute
                };
            }
            else if (!decodedToken) {
                routeMatch.log('No decoded token so assuming not authenticated. No "notAuthenticatedRoute" provided. Returning CONTINUE command');
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
            const user = yield app.auth().getUser(decodedToken.uid);
            if (!user) {
                throw new Error('Failed to get user with ID "' + decodedToken.uid + '"');
            }
            routeMatch.data[routeTaskConfig.name] = user;
            routeMatch.log('Got user:', user, '. Returning CONTINUE command');
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseAuth = TaskFirebaseAuth;
/* tslint:enable:no-any */
//# sourceMappingURL=task-firebase-auth.js.map