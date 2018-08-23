import Mailgun = require('mailgun-js');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskMailgun extends TaskBase {
  connections: MailgunConnectionMap = {};

  constructor(connectionConfigs: MailgunConnectionConfigMap) {
    super();
    const connectionNames = Object.keys(connectionConfigs);
    connectionNames.forEach((connectionName: string) => {
      const connectionConfig = connectionConfigs[connectionName];
      this.connections[connectionName] = new Mailgun(connectionConfig);
    });
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
    const dataParsed = (JSON.parse(dataJson) as SendData | SendData[]);
    const dataArray: SendData[] =
        Array.isArray(dataParsed) ? dataParsed : [dataParsed];

    const report: ReportItem[] = [];

    for (let i = 0; i < dataArray.length; ++i) {
      const data = dataArray[i];
      if (!data) continue;
      try {
        const response: SendResponse = await this.sendEmail(data);
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

  sendEmail(data: SendData): Promise<SendResponse> {
    return new Promise<SendResponse>((resolve, reject) => {
      const emailer = this.connections[data.connectionName];
      emailer.messages().send(data, (err: any, body: SendResponse) => {
        if (err) return reject(err);
        return resolve(body);
      });
    });
  }
}

export interface TaskMailgunConfiguration {
  template: string;
}

export interface MailgunConnectionConfigMap {
  [name: string]: ConstructorParams;
}

export interface MailgunConnectionMap {
  [name: string]: any;
}

export interface ReportItem {
  data: SendData;
  response: SendResponse|Error;
}

export interface ConstructorParams {
  apiKey: string;
  publicApiKey?: string;
  domain: string;
  mute?: boolean;
  timeout?: number;
  host?: string;
  endpoint?: string;
  protocol?: string;
  port?: number;
  retry?: number;
  proxy?: string;
}

export interface SendData {
  from: string;
  to: string|string[];
  cc?: string;
  bcc?: string;
  subject: string;
  text?: string;
  html?: string;
  attachment?: string|Buffer|NodeJS.ReadWriteStream|Attachment;
  connectionName: string;
}

export interface SendResponse {
  message: string;
  id: string;
}

export interface Attachment {
  new(params: AttachmentParams): void;
  data: string|Buffer|NodeJS.ReadWriteStream;
  filename?: string;
  knownLength?: number;
  contentType?: string;
  getType(): string;
}

export interface AttachmentParams {
  data: string|Buffer|NodeJS.ReadWriteStream;
  filename?: string;
  knownLength?: number;
  contentType?: string;
}
/* tslint:enable:no-any */
