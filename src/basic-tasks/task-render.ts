import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

export class TaskRender extends TaskBase {
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskRenderConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;
    const template = this.getTemplate(config.template, routeMatch);
    const rendered =
        await (renderer as RendererBase).render(template, routeMatch);
    if (config.output === 'data') {
      routeMatch.data[routeTaskConfig.name] = rendered;
    } else if (config.output === 'body') {
      routeMatch.response.body = rendered;
    } else {
      throw new Error('No output specified');
    }
    return {command: TaskResultCommand.CONTINUE};
  }

  private getTemplate(pathOrTemplate: string, routeMatch: RouteMatch): string {
    if (pathOrTemplate.indexOf('>') === 0 &&
        pathOrTemplate.indexOf('\n') === -1) {
      const path = pathOrTemplate.substr(1);
      const template = dot.pick(path, routeMatch);
      return (template as string);
    } else {
      return pathOrTemplate;
    }
  }
}

export interface TaskRenderConfiguration {
  template: string;
  output: 'data'|'body';
}
