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
class TaskFirebaseGetUser extends task_base_1.TaskBase {
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
            const app = this.apps[appName];
            const userIdentifier = routeMatch.getString(config.userIdentifier);
            let user;
            if (config.userIdentifier.indexOf('@') > -1) {
                try {
                    user = yield app.auth().getUserByEmail(userIdentifier);
                }
                catch (err) {
                    routeMatch.error(err, 'Failed to get user by email');
                }
            }
            else {
                try {
                    user = yield app.auth().getUser(userIdentifier);
                }
                catch (err) {
                    routeMatch.error(err, 'Failed to get user by Id');
                }
            }
            if (!user) {
                throw new Error('Failed to get user "' + userIdentifier + '"');
            }
            routeMatch.setData(user);
            routeMatch.log('Got user:', user, '. Returning CONTINUE command');
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseGetUser = TaskFirebaseGetUser;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-firebase-get-user.js.map