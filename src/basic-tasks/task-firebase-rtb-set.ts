import * as firebase from 'firebase-admin';
import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskFirebaseRtbSet extends TaskBase {
  constructor(private apps: {[name: string]: firebase.app.App}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskFirebaseRtbSetConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;

    if (config.setOrUpdate !== 'set' && config.setOrUpdate !== 'update') {
      throw new Error('No "setOrUpdate" property given');
    }

    const appName = routeMatch.getString(config.appName);
    if (!this.apps.hasOwnProperty(appName)) {
      throw new Error('No Firebase app named "' + appName + '" registered');
    }

    const app = this.apps[appName];
    const path = await renderer.render(config.pathTemplate, routeMatch);
    const dataJson = await renderer.render(config.dataTemplate, routeMatch);
    const data = JSON.parse(dataJson);

    const response:
        FirebaseRtbSetResponse = {path, data, setOrUpdate: config.setOrUpdate};

    if (config.setOrUpdate === 'set') {
      await app.database().ref(path).set(data);
    } else {
      await app.database().ref(path).update(data);
    }

    routeMatch.data[routeTaskConfig.name] = response;

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskFirebaseRtbSetConfiguration {
  appName: string;
  pathTemplate: string;
  dataTemplate: string;
  parseJson?: boolean;
  setOrUpdate: string;
}

export interface FirebaseRtbSetResponse {
  setOrUpdate: string;
  path: string;
  data: any;
}
/* tslint:enable:no-any */
