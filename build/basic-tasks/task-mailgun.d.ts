/// <reference types="node" />
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskMailgun extends TaskBase {
    connections: MailgunConnectionMap;
    constructor(connectionConfigs: MailgunConnectionConfigMap);
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskMailgunConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    sendEmail(data: SendData): Promise<SendResponse>;
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
    connectionName: string;
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
