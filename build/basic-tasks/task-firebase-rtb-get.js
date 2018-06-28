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
class TaskFirebaseRtbGet extends task_base_1.TaskBase {
    constructor(apps) {
        super();
        this.apps = apps;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const appName = routeMatch.getString(config.appName);
            if (!this.apps.hasOwnProperty(appName)) {
                throw new Error('No Firebase app named "' + appName + '" registered');
            }
            const app = this.apps[appName];
            const path = yield renderer.render(config.pathTemplate, routeMatch);
            const snapshot = yield app.database().ref(path).once('value');
            if (snapshot.exists()) {
                const data = snapshot.val();
                routeMatch.data[routeTaskConfig.name] = data;
            }
            else if (config.defaultData) {
                routeMatch.data[routeTaskConfig.name] = config.defaultData;
            }
            else {
                throw new Error('Failed to load data from "' + path + '"');
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseRtbGet = TaskFirebaseRtbGet;
/* tslint:enable:no-any */
//# sourceMappingURL=task-firebase-rtb-get.js.map