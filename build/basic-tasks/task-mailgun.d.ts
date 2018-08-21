/// <reference types="node" />
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
    [name: string]: ConstructorParams;
}
export interface ReportItem {
    data: SendData;
    response: SendResponse | Error;
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
    to: string | string[];
    cc?: string;
    bcc?: string;
    subject: string;
    text?: string;
    html?: string;
    attachment?: string | Buffer | NodeJS.ReadWriteStream | Attachment;
}
export interface SendResponse {
    message: string;
    id: string;
}
export interface Attachment {
    new (params: AttachmentParams): void;
    data: string | Buffer | NodeJS.ReadWriteStream;
    filename?: string;
    knownLength?: number;
    contentType?: string;
    getType(): string;
}
export interface AttachmentParams {
    data: string | Buffer | NodeJS.ReadWriteStream;
    filename?: string;
    knownLength?: number;
    contentType?: string;
}
