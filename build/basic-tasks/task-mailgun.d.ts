import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskMailgun extends TaskBase {
    private connectionConfigs;
    constructor(connectionConfigs: MailgunConnectionMap);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskMailgunConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    sendEmail(mailer: any, data: any): Promise<any>;
}
export interface TaskMailgunConfiguration {
    template: string;
    connectionName: string;
}
export interface MailgunConnectionMap {
    [name: string]: Mailgun.ConstructorParams;
}
export interface ReportItem {
    data: Mailgun.messages.SendData;
    response: Mailgun.messages.SendResponse | Error;
}
