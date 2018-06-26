import { TaskBase } from './task-base';
export declare class TaskModuleManager {
    private taskModuleMap;
    constructor(taskModuleMap: TaskModuleMap);
    getTaskModule(moduleName: string): TaskBase;
    hasTaskModule(moduleName: string): boolean;
}
export interface TaskModuleMap {
    [name: string]: TaskBase;
}
