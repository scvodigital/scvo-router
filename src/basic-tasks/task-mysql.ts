import mysql = require('mysql');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskMySQL extends TaskBase {
  pools: Record<string, mysql.Pool> = {};

  constructor(private connectionConfigs: ConnectionMap) {
    super();

    for (const connectionName of Object.keys(connectionConfigs)) {
      this.pools[connectionName] =
          mysql.createPool(connectionConfigs[connectionName]);
    }
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
    const connection = this.pools[config.connectionName];
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

    routeMatch.data[routeTaskConfig.name] = data;

    return {command: TaskResultCommand.CONTINUE};
  }

  async executeQuery(
      routeMatch: RouteMatch, connection: mysql.Pool, queryTemplate: string,
      renderer: RendererBase): Promise<any> {
    // const query = await renderer.render(queryTemplate, routeMatch);
    // const results = await this.query(connection, query);

    // return results;

    return new Promise<any>((resolve, reject) => {
      queryTemplate = routeMatch.getString(queryTemplate);
      renderer.render(queryTemplate, routeMatch)
          .then((query) => {
            routeMatch.log('About to execute query:', query);
            connection.query(query, (error, results, fields) => {
              if (error) {
                return reject(error);
              } else {
                return resolve(results);
              }
            });
          })
          .catch((err) => {
            return reject(err);
          });
    });
  }

  query(connection: mysql.Pool, sql: string) {
    return new Promise<any>((resolve, reject) => {
      connection.query(sql, (error, results, fields) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results);
        }
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