"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-any */
var TaskModuleManager = /** @class */ (function () {
    function TaskModuleManager(taskModuleMap) {
        this.taskModuleMap = taskModuleMap;
    }
    TaskModuleManager.prototype.getTaskModule = function (moduleName) {
        if (!this.hasTaskModule(moduleName)) {
            throw new Error('No Task Module named "' + moduleName + '" loaded');
        }
        var taskModule = this.taskModuleMap[moduleName];
        return taskModule;
    };
    TaskModuleManager.prototype.hasTaskModule = function (moduleName) {
        return this.taskModuleMap.hasOwnProperty(moduleName);
    };
    return TaskModuleManager;
}());
exports.TaskModuleManager = TaskModuleManager;
/* tslint:enable:no-any */
//# sourceMappingURL=task-module-manager.js.map