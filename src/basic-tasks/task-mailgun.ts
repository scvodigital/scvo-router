/* tslint:disable:no-any */
import Mailgun = require('mailgun-js');
const mailComposer: any = require('nodemailer/lib/mail-composer');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

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
    const promises: Array<Promise<ReportItem>> = [];

    for (let i = 0; i < dataArray.length; ++i) {
      const data = dataArray[i];
      if (!data) continue;
      promises.push(this.sendEmail(data));
    }

    const responses = await Promise.all(promises);

    routeMatch.setData(responses);

    return {command: TaskResultCommand.CONTINUE};
  }

  sendEmail(data: SendData): Promise<ReportItem> {
    return new Promise<ReportItem>((resolve, reject) => {
      const emailer = this.connections[data.connectionName];
      const mail = new mailComposer(data);
      mail.compile().build((err: any, message: any) => {
        if (data.html) delete data.html;
        if (data.text) delete data.text;
        if (err) {
          return resolve({data, response: err});
        }

        data.message = message.toString('ascii');
        emailer.messages().sendMime(data, (err: any, body: SendResponse) => {
          data.message = data.message.substr(0, 255);
          if (err) {
            resolve({data, response: err});
          } else {
            resolve({data, response: body});
          }
        });
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
  message?: any;
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
