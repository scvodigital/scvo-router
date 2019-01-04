import * as querystring from 'querystring';
import deepExtend = require('deep-extend');
import dot = require('dot-object');
import {format} from 'date-fns';
import stringify = require('json-stringify-safe');

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
  logs: string[] = [];
  currentTask: RouteTaskConfiguration<any>|null = null;
  currentTaskIndex = 0;
  reroutes: RouteConfiguration[] = [];

  private get dp(): string {
    const currentTaskLabel = this.currentTask ?
        '(' + this.currentTaskIndex + ') ' + this.currentTask.name :
        '';

    return '[' + this.request.url.host + ' | ' + this.route.name +
        (this.currentTask ? ' -> ' + currentTaskLabel : '') + ']';
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
    this.log('Started executing route');
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

        this.log('Current task index:', this.currentTaskIndex);

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
    this.log('Finished executing route');
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
    if (typeof pathOrVal !== 'string') {
      throw new Error('Path or Value is not a string');
    } else if (pathOrVal.indexOf('>') === 0 && pathOrVal.indexOf('\n') === -1) {
      const path = pathOrVal.substr(1);
      this.log('Getting string from:', path);
      const val = dot.pick(path, this);
      if (!val) {
        this.log('No value found at:', path);
      }
      return (val as string);
    } else {
      return pathOrVal;
    }
  }

  getObject(pathOrVal: any): any {
    if (typeof pathOrVal === 'string' && pathOrVal.indexOf('>') === 0 &&
        pathOrVal.indexOf('\n') === -1) {
      const path = pathOrVal.substr(1);
      this.log('Getting object from:', path);
      const val = dot.pick(path, this);
      if (!val) {
        this.log('No value found at:', path);
      }
      return val;
    } else {
      return pathOrVal;
    }
  }

  setData(data: any) {
    if (this.currentTask === null) {
      console.error(
          'This should not have happened! Setting task data when there is no task');
      return;
    }
    const taskName = this.currentTask.name;
    this.data[taskName] = data;
  }

  log(...args: any[]) {
    if (this.route.debug) {
      const timestamp = format(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS');
      console.log(this.dp, ...args);
      const logMessageLines = [this.dp + ' ' + timestamp];
      for (let a = 0; a < arguments.length; ++a) {
        const arg = arguments[a];
        logMessageLines.push(a + ': ' + stringify(arg, null, 4));
      }
      const logMessage = logMessageLines.join('\n');
      this.logs.push(logMessage);
    }
  }

  error(error: Error, message = 'No additional message provided') {
    const timestamp = new Date();
    if (this.currentTask === null) {
      console.error(
          'This should not have happened! Task error with no task! Here\'s the error anyway:',
          error);
      return;
    }
    if (this.route.debug) {
      console.error(this.dp, error, message);
    }
    const taskError: TaskError = {
      timestamp,
      routeName: this.route.name,
      taskName: this.currentTask.name,
      taskIndex: this.currentTaskIndex,
      error,
      message
    };
    this.errors.push(taskError);
  }
}

export interface TaskModuleMap {
  [name: string]: TaskBase;
}

export interface TaskError {
  timestamp: Date;
  routeName: string;
  taskName: string;
  taskIndex: number;
  error: Error;
  message: string;
}
/* tslint:enable:no-any */