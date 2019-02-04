import dot = require('dot-object');
import * as jsforce from 'jsforce';

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskSalesforceBulk extends TaskBase {
  constructor(private connections: {[name: string]: SFAuthDetails}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskSalesforceBulkConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;
    const connection = this.connections[config.connection];

    routeMatch.log('Creating Salesforce client and logging in', connection);
    const sfClient = new jsforce.Connection({loginUrl: connection.loginUrl});
    const loginResponse =
        await sfClient.login(connection.username, connection.password);
    routeMatch.log('Salesforce login response:', loginResponse);

    const template = routeMatch.getString(config.recordsTemplate);
    const rendered = await renderer.render(template, routeMatch);
    const records = typeof rendered === 'string' ?
        JSON.parse(rendered) as any[] :
        rendered as any[];

    routeMatch.log(
        'Got records', records.slice(0, 10), '...[', records.length,
        'total records]');

    const results =
        await this.executeBatch(records, config, sfClient, routeMatch);
    routeMatch.setData(results);

    routeMatch.log('Done, returning CONTINUE command');

    return {command: TaskResultCommand.CONTINUE};
  }

  executeBatch(
      records: any[], config: TaskSalesforceBulkConfiguration,
      sfClient: jsforce.Connection, routeMatch: RouteMatch): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        const job = sfClient.bulk.createJob(
            config.type, config.operation, config.bulkOptions);
        sfClient.bulk.pollInterval = 1000;
        sfClient.bulk.pollTimeout = 30000;
        const batch = job.createBatch();
        batch.on('error', (batchInfo: any) => {
          reject(new BatchError('Batch Error', [batchInfo]));
        });
        batch.on('queue', (batchInfo: any) => {
          // batch.poll(1000, 20000);
          routeMatch.log('Batch Queue:', batchInfo);
        });
        batch.on('response', (rets: any) => {
          const errors: any[] = [];
          const successes: any[] = [];
          rets.forEach((ret: any) => {
            if (!ret.success) {
              errors.push(ret);
            } else {
              successes.push(ret);
            }
          });
          routeMatch.log(
              'Batch completed.', successes.length, 'succeeded, and',
              errors.length, 'failed.');
          if (errors.length > 0) {
            routeMatch.error(
                new BatchError('Failed operations', errors),
                'Failed operations');
          }
          resolve({successes, errors});
        });
        routeMatch.log(
            'About to execute batch job on', records.length, 'records');
        batch.execute(records);
      } catch (err) {
        routeMatch.error(err, 'Failed to run batch job');
        reject(err);
      }
    });
  }
}

export interface TaskSalesforceBulkConfiguration {
  connection: string;
  recordsTemplate: string;
  bulkOptions: jsforce.BulkOptions;
  type: string;
  operation: string;
}

export interface SFAuthDetails {
  username: string;
  password: string;
  loginUrl: string;
}

export class BatchError extends Error {
  constructor(message: string, public operationErrors: any[]) {
    super(message);
  }
}
/* tslint:enable:no-any */