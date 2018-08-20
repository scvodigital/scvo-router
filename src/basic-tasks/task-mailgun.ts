import Mailgun = require('mailgun-js');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskMailgun extends TaskBase {
  constructor(private connectionConfigs: MailgunConnectionMap) {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskMailgunConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }
    const config = routeTaskConfig.config;

    const template = routeMatch.getString(config.template);
    const dataJson = await renderer.render(template, routeMatch);
    const dataParsed =
        (JSON.parse(dataJson) as Mailgun.messages.SendData |
         Mailgun.messages.SendData[]);
    const dataArray: Mailgun.messages.SendData[] =
        Array.isArray(dataParsed) ? dataParsed : [dataParsed];

    const connectionConfig = this.connectionConfigs[config.connectionName];
    const mailer = new Mailgun(connectionConfig);

    const report: ReportItem[] = [];

    for (let i = 0; i < dataArray.length; ++i) {
      const data = dataArray[i];
      try {
        const response: Mailgun.messages.SendResponse =
            await this.sendEmail(mailer, data);
        routeMatch.log('Send email call successful', data.to, response);
        report.push({data, response});
      } catch (err) {
        console.error('Failed to sent:', data, err);
        report.push({data, response: err});
        routeMatch.error(err);
      }
    }

    routeMatch.setData(report);

    return {command: TaskResultCommand.CONTINUE};
  }

  sendEmail(mailer: any, data: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mailer.messages().send(data, (err: any, body: any) => {
        if (err) return reject(err);
        return resolve(body);
      });
    });
  }
}
/* tslint:enable:no-any */

export interface TaskMailgunConfiguration {
  template: string;
  connectionName: string;
}

export interface MailgunConnectionMap {
  [name: string]: Mailgun.ConstructorParams;
}

export interface ReportItem {
  data: Mailgun.messages.SendData;
  response: Mailgun.messages.SendResponse|Error;
}
