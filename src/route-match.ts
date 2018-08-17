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
    clearCookies: {}
  };
  errors: TaskError[] = [];
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
    this.response.statusCode = matchedRoute.config.defaultStatusCode || 200;
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
              dot.pick(taskConfig, this) as RouteTaskConfiguration<any>;
        } else {
          this.currentTask = this.route.tasks[this.currentTaskIndex] as
              RouteTaskConfiguration<any>;
        }

        if (this.route.debug) {
          console.log(this.dp, 'Current task index:', this.currentTaskIndex);
        }

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
        this.error(err);
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
      this.currentTaskIndex = -1;
      this.response.statusCode = redirectRoute.defaultStatusCode || 200;
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
    qs = qs.replace(/(\[\])|(%5B%5D)/ig, '');

    const query = querystring.parse(
        qs, this.route.queryDelimiter, this.route.queryEquals);
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

  log(...args: any[]) {
    if (this.route.debug) {
      console.log(this.dp, ...args);
    }
  }

  error(error: Error) {
    if (this.currentTask === null) {
      console.error(
          'This should not have happened! Task error with no task! Here\'s the error anyway:',
          error);
      return;
    }
    if (this.route.debug) {
      console.error(this.dp, error);
    }
    const taskError: TaskError = {
      routeName: this.route.name,
      taskName: this.currentTask.name,
      taskIndex: this.currentTaskIndex,
      error
    };
    this.errors.push(taskError);
  }
}

export interface TaskModuleMap {
  [name: string]: TaskBase;
}

export interface TaskError {
  routeName: string;
  taskName: string;
  taskIndex: number;
  error: Error;
}
/* tslint:enable:no-any */
