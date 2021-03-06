import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

export class TaskRender extends TaskBase {
  /* tslint:disable:no-any */
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskRenderConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;
    const template = routeMatch.getObject(config.template);
    routeMatch.log('Loaded  template:', template);

    let rendered: any;
    try {
      rendered = await (renderer as RendererBase).render(template, routeMatch);
    } catch (err) {
      console.error('Failed to render template', err);
      throw err;
    }
    routeMatch.log('Rendered template output:', rendered);

    if (config.parseJson) {
      try {
        rendered = JSON.parse(rendered);
      } catch (err) {
        console.error('Failed to parse JSON', err, rendered);
        throw err;
      }
    }

    if (config.output === 'data') {
      routeMatch.data[routeTaskConfig.name] = rendered;
    } else if (config.output === 'body') {
      routeMatch.response.body = rendered;
    } else {
      throw new Error('No output specified');
    }

    if (routeMatch.route.debug) {
      routeMatch.log(rendered);
    }

    if (config.contentType) {
      routeMatch.response.contentType = config.contentType;
    }

    if (config.filename) {
      const filename =
          await (renderer as RendererBase).render(config.filename, routeMatch);
      routeMatch.response.headers['Content-Disposition'] =
          'attachment; filename=' + filename;
    }

    return {command: TaskResultCommand.CONTINUE};
  }
  /* tslint:enable:no-any */

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
  parseJson?: boolean;
  contentType?: string;
  filename?: string;
}