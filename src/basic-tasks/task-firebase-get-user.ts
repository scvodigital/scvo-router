import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration, Cookie, CookieOptions} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskFirebaseGetUser extends TaskBase {
  constructor(private apps: {[name: string]: firebase.app.App}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskFirebaseGetUserConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config = routeTaskConfig.config;

    const appName = routeMatch.getString(config.appName);
    if (!this.apps.hasOwnProperty(appName)) {
      throw new Error('No Firebase app named "' + appName + '" registered');
    }

    const app = this.apps[appName];
    const userIdentifier = routeMatch.getString(config.userIdentifier);
    let user: firebase.auth.UserRecord|undefined;

    if (userIdentifier.indexOf('@') > -1) {
      try {
        user = await app.auth().getUserByEmail(userIdentifier);
      } catch (err) {
        routeMatch.error(err, 'Failed to get user by email');
      }
    } else {
      try {
        user = await app.auth().getUser(userIdentifier);
      } catch (err) {
        routeMatch.error(err, 'Failed to get user by Id');
      }
    }

    if (!user) {
      throw new Error('Failed to get user "' + userIdentifier + '"');
    }

    routeMatch.setData(user);
    routeMatch.log('Got user:', user, '. Returning CONTINUE command');

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseGetUserConfiguration {
  appName: string;
  userIdentifier: string;
}
/* tslint:enable:no-any */