import jsonLogic = require('json-logic-js');
import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';
import {RendererBase} from '../renderer-base';

/* tslint:disable:no-any */
export class TaskReroute extends TaskBase {
  async execute(
      routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<any>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config: any = routeTaskConfig.config;
    const routeName = jsonLogic.apply(config, routeMatch);
    if (routeName) {
      return {command: TaskResultCommand.REROUTE, routeName};
    } else {
      return {command: TaskResultCommand.CONTINUE};
    }
  }
}