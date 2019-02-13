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

    let cookie = routeMatch.request.cookies[config.cookieName];
    const idToken = dot.pick(config.tokenPath, routeMatch);

    routeMatch.log('Config', config);

    if ((!idToken || !cookie) && config.noTokenRoute) {
      routeMatch.log(
          'No ID Token or Cookie and a "noTokenRoute" has been provided. Returning REROUTE command:',
          config.noTokenRoute);
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.noTokenRoute
      };
    } else if (!idToken && !cookie) {
      routeMatch.log('No ID Token. Returning CONTINUE command');
      return {command: TaskResultCommand.CONTINUE};
    }

    const app = this.apps[appName];
    let decodedToken: undefined|firebase.auth.DecodedIdToken;

    if (cookie) {
      try {
        routeMatch.log('Got Cookie:', cookie, 'Verifying...');
        decodedToken = await app.auth().verifySessionCookie(cookie);
        routeMatch.log('Decoded Cookie:', decodedToken);
      } catch (err) {
        console.error('Failed to verify session cookie:', err);
      }
    } else {
      try {
        routeMatch.log('Got Token but no Cookie:', idToken, 'Verifying...');
        decodedToken = await app.auth().verifyIdToken(idToken);
        routeMatch.log('Decoded Token:', decodedToken);
        if (decodedToken) {
          routeMatch.log('Exchangin token for 2 week cookie');
          cookie = await app.auth().createSessionCookie(
              idToken, {expiresIn: 1209600000});
          routeMatch.log(
              'Got the Cookie!:', cookie,
              '\nStoring it here:', config.cookieName);
          const cookieObj:
              Cookie = {value: cookie, options: config.cookieOptions};
          routeMatch.response.cookies[config.cookieName] = cookieObj;
        }
      } catch (err) {
        routeMatch.error(err);
      }
    }

    if (!decodedToken && config.notAuthenticatedRoute) {
      routeMatch.log(
          'No decoded token so assuming not authenticated. "notAuthenticatedRoute" provided. Returning REROUTE command:',
          config.notAuthenticatedRoute);
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.notAuthenticatedRoute
      };
    } else if (!decodedToken) {
      routeMatch.log(
          'No decoded token so assuming not authenticated. No "notAuthenticatedRoute" provided. Returning CONTINUE command');
      return {command: TaskResultCommand.CONTINUE};
    }

    const user = await app.auth().getUser(decodedToken.uid);

    if (!user) {
      throw new Error('Failed to get user with ID "' + decodedToken.uid + '"');
    }

    routeMatch.data[routeTaskConfig.name] = user;

    routeMatch.log('Got user:', user, '. Returning CONTINUE command');

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseAuthConfiguration {
  tokenPath: string;
  cookieName: string;
  cookieOptions?: CookieOptions;
  appName: string;
  noTokenRoute?: string;
  notAuthenticatedRoute?: string;
}
/* tslint:enable:no-any */