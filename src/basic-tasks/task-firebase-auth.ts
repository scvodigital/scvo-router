import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration, Cookie, CookieOptions} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskFirebaseAuth extends TaskBase {
  constructor(private apps: {[name: string]: firebase.app.App}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskFirebaseAuthConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config = routeTaskConfig.config;

    const appName = routeMatch.getString(config.appName);
    if (!this.apps.hasOwnProperty(appName)) {
      throw new Error('No Firebase app named "' + appName + '" registered');
    }

    const cookie = routeMatch.request.cookies[config.cookieName];

    routeMatch.log('Config', config);

    if (!cookie) {
      return this.getNoAuthReturn(
          routeMatch, config, 'No Cookie found or provided');
    }

    const app = this.apps[appName];

    let uid = '';
    try {
      routeMatch.log('Got Cookie:', cookie, 'Verifying...');
      const decodedToken = await app.auth().verifySessionCookie(cookie);
      if (!decodedToken) {
        throw new Error('No Decoded Token after verifying Session Cookie');
      }
      routeMatch.log('Decoded Cookie:', decodedToken);
      uid = decodedToken.uid;
    } catch (err) {
      routeMatch.log('Failed to verify session cookie:', err);
      return this.getNoAuthReturn(
          routeMatch, config, 'Failed to verify session cookie');
    }

    try {
      routeMatch.log('Getting user for User Id', uid);
      const user = await app.auth().getUser(uid);
      if (!user) {
        throw new Error('Failed to get user with ID "' + uid + '"');
      }
      routeMatch.log('Got user', user);
      routeMatch.setData(user);
      return {command: TaskResultCommand.CONTINUE};
    } catch (err) {
      routeMatch.log('Failed to get user:', err);
      return this.getNoAuthReturn(
          routeMatch, config, 'Failed to get user for User Id', uid);
    }
  }

  getNoAuthReturn(
      routeMatch: RouteMatch, config: TaskFirebaseAuthConfiguration,
      ...args: any[]): TaskResult {
    if (config.notAuthenticatedRoute) {
      routeMatch.log(
          ...args, 'Has notAuthenticatedRoute so returning REROUTE command',
          config.notAuthenticatedRoute);
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.notAuthenticatedRoute
      };
    } else {
      routeMatch.log(
          ...args, 'No notAuthenticatedRoute to returning CONTINUE command');
      return {command: TaskResultCommand.CONTINUE};
    }
  }
}

export interface TaskFirebaseAuthConfiguration {
  cookieName: string;
  cookieOptions?: CookieOptions;
  appName: string;
  notAuthenticatedRoute?: string;
}
/* tslint:enable:no-any */