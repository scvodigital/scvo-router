import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskFirebaseRtbGet extends TaskBase {
  constructor(private apps: {[name: string]: firebase.app.App}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskFirebaseRtbGetConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;

    const appName = routeMatch.getString(config.appName);
    if (!this.apps.hasOwnProperty(appName)) {
      throw new Error('No Firebase app named "' + appName + '" registered');
    }

    const app = this.apps[appName];
    const path = await renderer.render(config.pathTemplate, routeMatch);
    const snapshot = await app.database().ref(path).once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      routeMatch.data[routeTaskConfig.name] = data;
    } else if (config.defaultData) {
      routeMatch.data[routeTaskConfig.name] = config.defaultData;
    } else {
      throw new Error('Failed to load data from "' + path + '"');
    }

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseRtbGetConfiguration {
  appName: string;
  pathTemplate: string;
  defaultData?: any;
}
/* tslint:enable:no-any */
