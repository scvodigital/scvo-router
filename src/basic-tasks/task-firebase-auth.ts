import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
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

    let cookie = dot.pick(config.cookiePath, routeMatch);
    const idToken = dot.pick(config.tokenPath, routeMatch);

    if (!idToken && !cookie && config.noTokenRoute) {
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.noTokenRoute
      };
    } else if (!idToken) {
      return {command: TaskResultCommand.CONTINUE};
    }

    const app = this.apps[appName];
    let decodedToken: undefined|firebase.auth.DecodedIdToken;

    if (cookie) {
      try {
        routeMatch.log('Got Cookie:', cookie);
        decodedToken = await app.auth().verifySessionCookie(cookie);
        routeMatch.log('Decoded Cookie:', decodedToken);
      } catch (err) {
      }
    } else {
      try {
        routeMatch.log('Got Token but no Cookie:', idToken);
        decodedToken = await app.auth().verifyIdToken(idToken);
        routeMatch.log('Decoded Token:', decodedToken);
        if (decodedToken) {
          routeMatch.log('Exchangin token for 2 week cookie');
          cookie = await app.auth().createSessionCookie(
              idToken, {expiresIn: 1209600000});
          routeMatch.log(
              'Got the Cookie!:', cookie,
              '\nStoring it here:', config.cookiePath);
          dot.set(config.cookiePath, cookie, routeMatch);
        }
      } catch (err) {
      }
    }

    if (!decodedToken && config.notAuthenticatedRoute) {
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.notAuthenticatedRoute
      };
    } else if (!decodedToken) {
      return {command: TaskResultCommand.CONTINUE};
    }

    const user = await app.auth().getUser(decodedToken.uid);

    if (!user) {
      throw new Error('Failed to get user with ID "' + decodedToken.uid + '"');
    }

    routeMatch.data[routeTaskConfig.name] = user;

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseAuthConfiguration {
  tokenPath: string;
  cookiePath: string;
  appName: string;
  noTokenRoute?: string;
  notAuthenticatedRoute?: string;
}
/* tslint:enable:no-any */
