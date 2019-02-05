import request = require('request-promise-native');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';
import {RendererBase} from '../renderer-base';

/* tslint:disable:no-any */
export class TaskRequest extends TaskBase {
  constructor(private secrets: any = {}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig:
          RouteTaskConfiguration<TaskRequestConfiguration|
                                 TaskRequestTemplatedConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    let config: TaskRequestConfiguration|TaskRequestTemplatedConfiguration|
        undefined;
    const optionsMap: {[name: string]: request.Options} = {};

    if (routeTaskConfig.config.hasOwnProperty('optionsTemplates')) {
      config = (routeTaskConfig.config as TaskRequestTemplatedConfiguration);
      for (const name of Object.keys(config.optionsTemplates)) {
        const optionsTemplate = config.optionsTemplates[name];
        optionsMap[name] = await this.getTemplateOptions(
            routeMatch, optionsTemplate, renderer);
      }
    } else {
      config = (routeTaskConfig.config as TaskRequestConfiguration);
      const resolvedOptions =
          (routeMatch.getObject(config.options) as
           {[name: string]: request.Options});
      for (const name of Object.keys(resolvedOptions)) {
        const options = resolvedOptions[name];
        optionsMap[name] = routeMatch.getObject(options);
      }
    }

    const outputs: any = {};
    for (const name of Object.keys(optionsMap)) {
      const options = optionsMap[name];
      routeMatch.log('Requesting', options);
      const output = await request(options);
      outputs[name] = output;
    }

    routeMatch.setData(outputs);
    return {command: TaskResultCommand.CONTINUE};
  }

  async getTemplateOptions(
      routeMatch: RouteMatch, config: any,
      renderer?: RendererBase): Promise<request.Options> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const optionsTemplate = routeMatch.getObject(config);
    (routeMatch as any).secrets = this.secrets;
    const optionsString = await renderer.render(optionsTemplate, routeMatch);
    delete (routeMatch as any).secrets;

    routeMatch.log('optionsString is: ', optionsString);

    const options = typeof optionsString === 'string' ?
        JSON.parse(optionsString) :
        optionsString;
    return (options as request.Options);
  }
}

export interface TaskRequestTemplatedConfiguration {
  optionsTemplates: {[key: string]: any};
}

export interface TaskRequestConfiguration {
  options: {[key: string]: request.Options|string}|string;
}