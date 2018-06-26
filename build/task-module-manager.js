"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
class TaskModuleManager {
    constructor(taskModuleMap) {
        this.taskModuleMap = taskModuleMap;
    }
    getTaskModule(moduleName) {
        if (!this.hasTaskModule(moduleName)) {
            throw new Error('No Task Module named "' + moduleName + '" loaded');
        }
        const taskModule = this.taskModuleMap[moduleName];
        return taskModule;
    }
    hasTaskModule(moduleName) {
        return this.taskModuleMap.hasOwnProperty(moduleName);
    }
}
exports.TaskModuleManager = TaskModuleManager;
/* tslint:enable:no-any */
//# sourceMappingURL=task-module-manager.js.map