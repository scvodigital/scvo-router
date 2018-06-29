import * as querystring from 'querystring';
import deepExtend = require('deep-extend');
import dot = require('dot-object');

import {RouteConfiguration, RouterConfiguration, RouterRequest, RouterResponse, RouteTaskConfiguration} from './configuration-interfaces';
import {MatchedRoute} from './registered-route';
import {RendererManager, RendererMap} from './renderer-manager';
import {RendererBase} from './renderer-base';
import {TaskBase, TaskResultCommand} from './task-base';
import {TaskModuleManager} from './task-module-manager';

/* tslint:disable:no-any */
export class RouteMatch {
  route: RouteConfiguration;
  data: any = {};
  response: RouterResponse = {
    contentType: 'application/json',
    body: '{}',
    statusCode: 200,
    headers: {},
    cookies: {},
  };
  errors: Error[] = [];
  currentTask: RouteTaskConfiguration<any>|null = null;
  currentTaskIndex = 0;
  reroutes: RouteConfiguration[] = [];

  private get dp(): string {
    return '[' + this.route.name +
        (this.currentTask ? ' -> ' + this.currentTask.name : '') + ']';
  }

  constructor(
      matchedRoute: MatchedRoute, public request: RouterRequest,
      public context: RouterConfiguration,
      private taskModuleManager: TaskModuleManager,
      private rendererManager: RendererManager) {
    this.route = matchedRoute.config;
    this.route.tasks = this.route.tasks || [];
    this.response.cookies = request.cookies;
    this.mergeParams(matchedRoute.params);
  }

  async execute(): Promise<RouterResponse> {
    for (this.currentTaskIndex = 0;
         this.currentTaskIndex < this.route.tasks.length;
         ++this.currentTaskIndex) {
      try {
        const taskConfig = this.route.tasks[this.currentTaskIndex];
        if (typeof taskConfig === 'string') {
          this.currentTask =
              dot.pick(taskConfig, context) as RouteTaskConfiguration<any>;
        } else {
          this.currentTask = this.route.tasks[this.currentTaskIndex] as
              RouteTaskConfiguration<any>;
        }

        console.log(this.dp, 'Current task index:', this.currentTaskIndex);
        const taskModule =
            this.taskModuleManager.getTaskModule(this.currentTask.taskModule);

        let renderer: RendererBase|undefined;
        if (this.currentTask.renderer) {
          renderer =
              this.rendererManager.getRenderer(this.currentTask.renderer);
        }
        const taskResult =
            await taskModule.execute(this, this.currentTask, renderer);
        if (taskResult.command === TaskResultCommand.HALT) {
          break;
        } else if (taskResult.command === TaskResultCommand.REROUTE) {
          const redirectTo = taskResult.routeName || 'default';
          this.reroute(redirectTo);
        }
      } catch (err) {
        console.error(this.dp, 'Problem with task:', err);
        const errorRoute = err.errorRoute ||
            (this.currentTask as RouteTaskConfiguration<any>).errorRoute ||
            this.route.errorRoute || null;
        if (errorRoute) {
          this.reroute(errorRoute);
        }
      }
    }
    this.currentTaskIndex = 0;
    this.currentTask = null;
    return this.response;
  }

  private reroute(routeName: string) {
    if (this.route.name === routeName) {
      throw new Error(
          'A route cannot redirect to itself. Route name: ' + routeName);
    }
    this.reroutes.push(this.route);
    let redirectRoute: RouteConfiguration|null = null;
    for (let r = 0; r < this.context.routes.length; ++r) {
      const routeConfig = this.context.routes[r];
      if (routeConfig.name === routeName) {
        redirectRoute = routeConfig;
        break;
      }
    }
    if (redirectRoute) {
      this.currentTaskIndex = 0;
      this.route = redirectRoute;
    } else {
      throw new Error('Redirect route not found. Route name: ' + routeName);
    }
  }

  private mergeParams(matchedParams: any) {
    const params = {};
    const uri = this.request.url;

    Object.assign(params, this.route.defaultParams);
    Object.assign(params, matchedParams);

    let qs = uri.search || '?';
    qs = qs.substr(1);
    console.log('Query String Before:', qs);
    qs = qs.replace(/[\[\]]/ig, '');
    console.log('Query String After:', qs);

    const query = querystring.parse(
        qs, this.route.queryDelimiter, this.route.queryEquals);
    console.log('Query String Parsed:', query);
    let idFriendlyPath = (uri.pathname || '').replace(/\//g, '_');
    if (idFriendlyPath.startsWith('_')) {
      idFriendlyPath = idFriendlyPath.substr(1);
    }

    deepExtend(params, {query, path: idFriendlyPath, uri});

    this.request.params = params;
  }

  getString(pathOrVal: string): string {
    if (pathOrVal.indexOf('>') === 0 && pathOrVal.indexOf('\n') === -1) {
      const path = pathOrVal.substr(1);
      const val = dot.pick(path, this);
      if (!val) {
        console.log(this.dp, 'No value found at:', path);
      }
      return (val as string);
    } else {
      return pathOrVal;
    }
  }
}

export interface TaskModuleMap {
  [name: string]: TaskBase;
}
/* tslint:enable:no-any */
