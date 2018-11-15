import * as gapis from 'googleapis';
import {google} from 'googleapis';
import dot = require('dot-object');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

const analytics = google.analytics('v3');

/* tslint:disable:no-any */
export class TaskGAGet extends TaskBase {
  constructor(private connections: {[name: string]: GAAuthDetails}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskGAGetConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;
    const connection = this.connections[config.connection];

    routeMatch.log('Setting up new JWT Client');
    const scope = ['https://www.googleapis.com/auth/analytics.readonly'];
    const jwtClient = new google.auth.JWT(
        connection.clientEmail, undefined, connection.privateKey, scope,
        undefined);

    routeMatch.log('Authorising JWT Client');
    const credentials = await jwtClient.authorize();

    routeMatch.log('Setting credentials', credentials);
    jwtClient.setCredentials(credentials);
    google.options({auth: jwtClient});

    let parameters: gapis.analytics_v3.Params$Resource$Data$Ga$Get|undefined;

    if (typeof config.parameters === 'string') {
      routeMatch.log('Template passed as a template so rendering it');
      const template = routeMatch.getString(config.parameters);
      const rendered = await renderer.render(template, routeMatch);

      if (typeof rendered === 'string') {
        routeMatch.log('Renderer responsed with string so parsing it');
        parameters = JSON.parse(rendered) as
            gapis.analytics_v3.Params$Resource$Data$Ga$Get;
      } else {
        parameters = rendered as gapis.analytics_v3.Params$Resource$Data$Ga$Get;
      }
    } else {
      parameters = config.parameters;
    }

    routeMatch.log(
        'Parameters have been compiled into the following:', parameters);

    const options = {auth: jwtClient};

    routeMatch.log('Getting data using connection details:', options);
    const rows = await this.getData(parameters, options, routeMatch);


    routeMatch.log('Got data.', rows.length, 'rows');
    routeMatch.setData(rows);

    return {command: TaskResultCommand.CONTINUE};
  }

  async getData(
      params: gapis.analytics_v3.Params$Resource$Data$Ga$Get, options: any,
      routeMatch: RouteMatch): Promise<any[]> {
    const startIndex: number =
        params.hasOwnProperty('start-index') ? params['start-index'] || 0 : 0;
    routeMatch.log('Getting Analytics page offset by:', startIndex);
    const res = await analytics.data.ga.get(params, options);
    if (!res || !res.data || !res.data.rows) return [];
    const rows: any[] = res.data.rows || [];
    const totalResults = res.data.totalResults || 0;
    if (startIndex + rows.length < totalResults) {
      params['start-index'] = startIndex + rows.length;
      const nextPage = await this.getData(params, options, routeMatch);
      rows.push(...nextPage);
    }
    return rows;
  }
}

export interface TaskGAGetConfiguration {
  connection: string;
  parameters: gapis.analytics_v3.Params$Resource$Data$Ga$Get;
}

export interface GAAuthDetails {
  clientEmail: string;
  privateKey: string;
}
/* tslint:enable:no-any */