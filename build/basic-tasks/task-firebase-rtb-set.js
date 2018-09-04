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
class TaskFirebaseRtbSet extends task_base_1.TaskBase {
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
            if (config.setOrUpdate !== 'set' && config.setOrUpdate !== 'update') {
                throw new Error('No "setOrUpdate" property given');
            }
            const appName = routeMatch.getString(config.appName);
            if (!this.apps.hasOwnProperty(appName)) {
                throw new Error('No Firebase app named "' + appName + '" registered');
            }
            const pathTemplate = routeMatch.getString(config.pathTemplate);
            const dataTemplate = routeMatch.getString(config.dataTemplate);
            const app = this.apps[appName];
            routeMatch.log('About to render path template', pathTemplate);
            const path = yield renderer.render(pathTemplate, routeMatch);
            routeMatch.log('About to render dataTemplate');
            const dataJson = yield renderer.render(dataTemplate, routeMatch);
            routeMatch.log('Rendered data template', dataJson);
            const data = JSON.parse(dataJson);
            routeMatch.log('Data JSON parsed. Writing to firebase');
            const response = { path, data, setOrUpdate: config.setOrUpdate };
            if (config.setOrUpdate === 'set') {
                yield app.database().ref(path).set(data);
            }
            else {
                yield app.database().ref(path).update(data);
            }
            routeMatch.data[routeTaskConfig.name] = response;
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskFirebaseRtbSet = TaskFirebaseRtbSet;
/* tslint:enable:no-any */
//# sourceMappingURL=task-firebase-rtb-set.js.map