import {RouteMatch} from './route-match';
import {TaskBase} from './task-base';

/* tslint:disable:no-any */
export class TaskModuleManager {
  constructor(private taskModuleMap: TaskModuleMap) {}
  getTaskModule(moduleName: string): TaskBase {
    if (!this.hasTaskModule(moduleName)) {
      throw new Error('No Task Module named "' + moduleName + '" loaded');
    }
    const taskModule = this.taskModuleMap[moduleName];
    return taskModule;
  }
  hasTaskModule(moduleName: string): boolean {
    return this.taskModuleMap.hasOwnProperty(moduleName);
  }
}

export interface TaskModuleMap {
  [name: string]: TaskBase;
}
/* tslint:enable:no-any */
