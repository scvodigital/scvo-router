import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

export class TaskRedirect extends TaskBase {
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskRedirectConfiguration>):
      Promise<TaskResult> {
    const config = routeTaskConfig.config;
    routeMatch.response.headers.location = config.location;
    routeMatch.response.statusCode = config.statusCode || 301;
    return {command: TaskResultCommand.HALT};
  }
}

export interface TaskRedirectConfiguration {
  location: string;
  statusCode?: 301|303|307;
}
