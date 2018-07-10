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

    const idToken = dot.pick(config.tokenPath, routeMatch);

    if (!idToken && config.noTokenRoute) {
      return {
        command: TaskResultCommand.REROUTE,
        routeName: config.noTokenRoute
      };
    } else if (!idToken) {
      return {command: TaskResultCommand.CONTINUE};
    }

    const app = this.apps[appName];
    const decodedToken = await app.auth().verifyIdToken(idToken);

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
  appName: string;
  noTokenRoute?: string;
  notAuthenticatedRoute?: string;
}
/* tslint:enable:no-any */
