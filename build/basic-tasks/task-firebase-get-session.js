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
class TaskFirebaseGetSession extends task_base_1.TaskBase {
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
            routeMatch.log('Config', config);
            if (!idToken) {
                throw new Error('No ID Token provided. Returning CONTINUE command:');
            }
            const app = this.apps[appName];
            let uid = '';
            try {
                routeMatch.log('Docoding token');
                const decodedToken = yield app.auth().verifyIdToken(idToken);
                if (!decodedToken) {
                    throw new Error('Unknown error decoding token');
                }
                routeMatch.log('Decoded Token:', decodedToken);
                uid = decodedToken.uid;
            }
            catch (err) {
                routeMatch.error(err, 'Exception verifying Token. Returning CONTINUE command');
                throw err;
            }
            try {
                routeMatch.log('Exchangin token for 2 week cookie');
                const cookie = yield app.auth().createSessionCookie(idToken, { expiresIn: 1209600000 });
                routeMatch.log('Got the Cookie!:', cookie);
                const cookieObj = { value: cookie, options: config.cookieOptions };
                routeMatch.response.cookies[config.cookieName] = cookieObj;
            }
            catch (err) {
                routeMatch.error(err, 'Exception upgrading token for Session Cookie. Returning CONTINUE command');
                throw err;
            }
            let user;
            try {
                routeMatch.log('Finding user with id:', uid);
                user = yield app.auth().getUser(uid);
                if (!user) {
                    throw new Error('Failed to get user with ID "' + uid + '"');
                }
                routeMatch.setData(user);
                routeMatch.log('Got user:', user, '. Returning CONTINUE command');
            }
            catch (err) {
                routeMatch.error(err, 'Exception finding user. Returning CONTINUE command');
                throw err;
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseGetSession = TaskFirebaseGetSession;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-firebase-get-session.js.map