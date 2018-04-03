import * as util from 'util';

import {MenuDictionary, MenuItem, NamedPattern, NamedTemplate, RouteConfiguration, RouterConfiguration, RouterRequest, RouterResponse} from './interfaces';
import {RouteDestinationError, RouteError, RouteTaskError} from './route-errors';

export class RouteMatch {
  /* tslint:disable */
  data: any = {};
  response: RouterResponse = {
    contentType: 'application/json',
    body: '{}',
    statusCode: 200,
    headers: {},
    cookies: {},
  };
  /* tslint:enable */
  layoutName = 'default';
  errors: RouteError[] = [];

  constructor(
      public route: RouteConfiguration, public request: RouterRequest,
      public context: RouterConfiguration) {
    this.route.tasks = this.route.tasks || [];
    this.response.cookies = request.cookies;
  }

  async execute(): Promise<RouterResponse> {
    try {
      await this.runTasks();
      await this.runDestination();
      return this.response;
    } catch (err) {
      if (!(err instanceof RouteError)) {
        err = new RouteError(err, {
          statusCode: 500,
          sourceRoute: this,
          redirectTo: this.route.errorRoute || null,
          data: {}
        });
      }
      this.errors.push(err);
      throw err;
    }
  }

  private async runTasks(): Promise<void> {
    try {
      // console.log('#### ROUTEMATCH.runTasks() -> Running tasks');
      for (let i = 0; i < this.route.tasks.length; i++) {
        const task = this.route.tasks[i];
        // console.log('#### ROUTEMATCH.runTasks() -> Running task:', task.name,
        // '| type:', task.taskType);
        let routerTask;
        try {
          routerTask = this.context.routerTasks[task.taskType];
          this.data[task.name] = await routerTask.execute(this, task);
        } catch (err) {
          if (!(err instanceof RouteTaskError)) {
            err = new RouteTaskError(err, {
              statusCode: 500,
              sourceRoute: this,
              task,
              redirectTo: task.errorRoute || this.route.errorRoute || null,
              data: {}
            });
          } else {
            err.redirectTo = err.redirectTo || task.errorRoute ||
                this.route.errorRoute || null;
          }
          if (err.redirectTo) {
            throw err;
          } else {
            console.log(
                '#### RouteMatch.runTasks() -> Task error (but continuing):',
                err);
          }
        }
        // console.log('#### ROUTEMATCH.runTasks() -> Task completed:',
        // task.name);
      }
      // console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:',
      // this.data);
      return;
    } catch (err) {
      if (!(err instanceof RouteError)) {
        err = new RouteError(err, {
          statusCode: 500,
          sourceRoute: this,
          redirectTo: this.route.errorRoute || null,
          data: {}
        });
      } else {
        err.redirectTo = err.redirectTo || this.route.errorRoute || null;
      }
      console.error('#### RouteMatch -> Failed to run tasks:', err);
      throw err;
    }
  }

  private async runDestination(): Promise<void> {
    let routerDestination;
    try {
      routerDestination =
          this.context
              .routerDestinations[this.route.destination.destinationType];
      // console.log('#### ROUTEMATCH.runDestination() -> Running destination:',
      // routerDestination.name);
      let response: RouterResponse = {
        body: this.response.body,
        contentType: this.response.contentType,
        cookies: this.response.cookies,
        headers: this.response.headers,
        statusCode: this.response.statusCode
      };
      try {
        response = await routerDestination.execute(this);
      } catch (err) {
        if (!(err instanceof RouteDestinationError)) {
          err = new RouteDestinationError(err, {
            statusCode: 500,
            sourceRoute: this,
            destination: this.route.destination,
            redirectTo: this.route.errorRoute || null,
            data: {}
          });
        } else {
          err.redirectTo = err.redirectTo || this.route.errorRoute || null;
        }
        throw err;
      }
      // console.log('#### ROUTEMATCH.runDestination() -> Destination
      // completed:');
      Object.assign(this.response, response);
      this.response.cookies = response.cookies;  // Overwriting these in case
                                                 // cookies are cleared in the
                                                 // response
    } catch (err) {
      if (!(err instanceof RouteError)) {
        err = new RouteError(err, {
          statusCode: 500,
          sourceRoute: this,
          redirectTo: this.route.errorRoute || null,
          data: {}
        });
      } else {
        err.redirectTo = err.redirectTo || this.route.errorRoute || null;
      }
      console.error('#### RouteMatch -> Failed to run destination:', err);
      throw err;
    }
  }
}
