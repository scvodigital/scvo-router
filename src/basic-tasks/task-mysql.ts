import mysql = require('mysql');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskMySQL extends TaskBase {
  constructor(private connectionConfigs: ConnectionMap) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskMySQLConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;

    const data: any = {};
    const connectionConfig = this.connectionConfigs[config.connectionName];
    const connection = mysql.createConnection(connectionConfig);

    connection.connect();

    const queryTemplateNames = Object.keys(config.queryTemplates);
    for (let q = 0; q < queryTemplateNames.length; ++q) {
      const queryTemplateName = queryTemplateNames[q];
      const queryTemplate = config.queryTemplates[queryTemplateName];
      try {
        data[queryTemplateName] = await this.executeQuery(
            routeMatch, connection, queryTemplate, renderer);
      } catch (err) {
        throw err;
      }
    }

    connection.end();

    routeMatch.data[routeTaskConfig.name] = data;

    return {command: TaskResultCommand.CONTINUE};
  }

  executeQuery(
      routeMatch: RouteMatch, connection: mysql.Connection,
      queryTemplate: string, renderer: RendererBase): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      queryTemplate = routeMatch.getString(queryTemplate);
      renderer.render(queryTemplate, routeMatch).then((query) => {
        console.log('About to execute query:', query);
        connection.query(query, (error, results, fields) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(results);
          }
        });
      });
    });
  }
}

export interface ConnectionMap {
  [name: string]: mysql.ConnectionConfig;
}

export interface TaskMySQLConfiguration {
  connectionName: string;
  queryTemplates: {[name: string]: string};
}
/* tslint:enable:no-any */
