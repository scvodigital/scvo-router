import dot = require('dot-object');
import * as ua from 'universal-analytics';

import {RouteTaskConfiguration, Cookie, CookieOptions} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskGASet extends TaskBase {
  constructor() {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskGASetConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;

    const visitorOptions = await this.getObjectOrTemplate<ua.VisitorOptions>(
        config.options, config.optionsTemplate, renderer, routeMatch);
    if (!visitorOptions) {
      throw new Error('No visitor options');
    }

    const output: GASetOutput = {visitor: visitorOptions, actions: []};

    const visitor = new ua.Visitor(visitorOptions);
    let anyActions = false;

    for (const action of config.actions) {
      let params: undefined|ua.PageviewParams|ua.ScreenviewParams|
          ua.EventParams;
      switch (action.action) {
        case ('pageview'):
          params = await this.getObjectOrTemplate<ua.PageviewParams>(
              action.parameters, action.template, renderer, routeMatch);
          output.actions.push({action: action.action, params});
          if (params) {
            visitor.pageview(params);
            anyActions = true;
          }
          break;
        case ('screenview'):
          params = await this.getObjectOrTemplate<ua.ScreenviewParams>(
              action.parameters, action.template, renderer, routeMatch);
          output.actions.push({action: action.action, params});
          if (params) {
            visitor.screenview(params);
            anyActions = true;
          }
          break;
        case ('event'):
          params = await this.getObjectOrTemplate<ua.EventParams>(
              action.parameters, action.template, renderer, routeMatch);
          output.actions.push({action: action.action, params});
          if (params) {
            visitor.event(params);
            anyActions = true;
          }
          break;
        default:
          routeMatch.log('Invalid action', action);
      }
    }

    if (anyActions) {
      visitor.send();
    }

    routeMatch.setData(output);
    routeMatch.log('Returning CONTINUE command');

    return {command: TaskResultCommand.CONTINUE};
  }

  async getObjectOrTemplate<T>(
      obj: T|undefined, template: any|undefined, renderer: RendererBase,
      routeMatch: RouteMatch): Promise<T|undefined> {
    let output: T|undefined = obj;

    if (template) {
      template = routeMatch.getObject(template);
      const rendered = await renderer.render(template, routeMatch);
      if (typeof rendered === 'string') {
        try {
          output = JSON.parse(rendered) as T;
        } catch (err) {
          routeMatch.error(
              err,
              'Because output could not be parsed as a UA params object, leaving output empty');
        }
      } else {
        output = rendered as T;
      }
    }

    return output;
  }
}

export interface TaskGASetConfiguration {
  options?: ua.VisitorOptions;
  optionsTemplate?: any;
  actions: Array<{
    action: 'pageview' | 'screenview' | 'event'
    template?: any;
    parameters?: ua.PageviewParams | ua.ScreenviewParams | ua.EventParams;
  }>;
}

export interface GASetOutput {
  visitor: ua.VisitorOptions;
  actions: Array<{
    action: 'pageview' | 'screenview' | 'event'; params: ua.PageviewParams |
        ua.ScreenviewParams | ua.EventParams | undefined;
  }>;
}
/* tslint:enable:no-any */