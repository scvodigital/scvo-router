import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration, Cookie, CookieOptions} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskFirebaseGetSession extends TaskBase {
  constructor(private apps: {[name: string]: firebase.app.App}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig:
          RouteTaskConfiguration<TaskFirebaseGetSessionConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config = routeTaskConfig.config;

    const appName = routeMatch.getString(config.appName);
    if (!this.apps.hasOwnProperty(appName)) {
      throw new Error('No Firebase app named "' + appName + '" registered');
    }

    const idToken = dot.pick(config.tokenPath, routeMatch);

    routeMatch.log('Config', config);

    if (!idToken) {
      throw new Error('No ID Token provided. Returning CONTINUE command:');
    }

    const app = this.apps[appName];
    let uid = '';

    try {
      routeMatch.log('Docoding token');
      const decodedToken = await app.auth().verifyIdToken(idToken);
      if (!decodedToken) {
        throw new Error('Unknown error decoding token');
      }
      routeMatch.log('Decoded Token:', decodedToken);
      uid = decodedToken.uid;
    } catch (err) {
      routeMatch.error(
          err, 'Exception verifying Token. Returning CONTINUE command');
      throw err;
    }

    try {
      routeMatch.log('Exchangin token for 2 week cookie');
      const cookie = await app.auth().createSessionCookie(
          idToken, {expiresIn: 1209600000});
      routeMatch.log('Got the Cookie!:', cookie);
      const cookieObj: Cookie = {value: cookie, options: config.cookieOptions};
      routeMatch.response.cookies[config.cookieName] = cookieObj;
    } catch (err) {
      routeMatch.error(
          err,
          'Exception upgrading token for Session Cookie. Returning CONTINUE command');
      throw err;
    }

    let user: undefined|firebase.auth.UserRecord;
    try {
      routeMatch.log('Finding user with id:', uid);
      user = await app.auth().getUser(uid);
      if (!user) {
        throw new Error('Failed to get user with ID "' + uid + '"');
      }
      routeMatch.setData(user);
      routeMatch.log('Got user:', user, '. Returning CONTINUE command');
    } catch (err) {
      routeMatch.error(
          err, 'Exception finding user. Returning CONTINUE command');
      throw err;
    }

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseGetSessionConfiguration {
  tokenPath: string;
  cookieName: string;
  cookieOptions?: CookieOptions;
  appName: string;
}
/* tslint:enable:no-any */