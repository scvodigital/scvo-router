import * as jsforce from 'jsforce';

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';


/* tslint:disable:no-any */
export class TaskSalesforceApex extends TaskBase {
  constructor(private connections: {[name: string]: SFApexAuthDetails}) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskSalesforceApexConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config = routeTaskConfig.config;
    const connection = this.connections[config.connection];

    routeMatch.log('Creating Salesforce client and logging in', connection);
    const sfClient = new jsforce.Connection({loginUrl: connection.loginUrl});
    const loginResponse =
        await sfClient.login(connection.username, connection.password);
    routeMatch.log('Salesforce login response:', loginResponse);

    let body: any;
    if (config.body) {
      body = routeMatch.getObject(config.body);
      if (typeof body === 'string') {
        body = await (renderer as RendererBase).render(body, routeMatch);
        body = JSON.parse(body);
      }
    }

    let apexClassPath: any;
    apexClassPath = routeMatch.getObject(config.apexClassPath);
    apexClassPath =
        await (renderer as RendererBase).render(apexClassPath, routeMatch);

    const method = config.method.toLowerCase();

    routeMatch.log(
        'Requesting Apex Class:', apexClassPath, '| method', config.method,
        '| body:', body);

    let output: any;
    // All methods seem have the same signature
    output = await (sfClient.apex as any)[method](apexClassPath, body);
    if (config.output === 'data') {
      routeMatch.data[routeTaskConfig.name] = output;
    } else if (config.output === 'body') {
      routeMatch.response.body = output;
    } else {
      throw new Error('No output specified');
    }
    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface SFApexAuthDetails {
  username: string;
  password: string;
  loginUrl: string;
}


export interface TaskSalesforceApexConfiguration {
  connection: string;
  method: string;
  apexClassPath: string;
  body: any;
  output: string;
}
