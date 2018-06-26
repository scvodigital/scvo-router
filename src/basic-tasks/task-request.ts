import request = require('request-promise-native');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';
import {RendererBase} from '../renderer-base';

/* tslint:disable:no-any */
export class TaskRequest extends TaskBase {
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig:
          RouteTaskConfiguration<TaskRequestConfiguration|
                                 TaskRequestTemplatedConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    let config: TaskRequestConfiguration|TaskRequestTemplatedConfiguration|
        undefined;
    let options: request.Options|undefined;

    if (routeTaskConfig.config.hasOwnProperty('optionsTemplate')) {
      config = (routeTaskConfig.config as TaskRequestTemplatedConfiguration);
      options = await this.getTemplateOptions(routeMatch, config, renderer);
    } else {
      config = (routeTaskConfig.config as TaskRequestConfiguration);
      options = config.options;
    }

    const output = await request(options);
    routeMatch.data[routeTaskConfig.name] = output;

    return {command: TaskResultCommand.CONTINUE};
  }

  async getTemplateOptions(
      routeMatch: RouteMatch, config: TaskRequestTemplatedConfiguration,
      renderer?: RendererBase): Promise<request.Options> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const optionsString =
        await renderer.render(config.optionsTemplate, routeMatch);
    const options = JSON.parse(optionsString);

    return (options as request.Options);
  }
}

export interface TaskRequestTemplatedConfiguration {
  optionsTemplate: string;
}

export interface TaskRequestConfiguration {
  options: request.Options;
}
