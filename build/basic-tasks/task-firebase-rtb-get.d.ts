import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseRtbGet extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseRtbGetConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskFirebaseRtbGetConfiguration {
    appName: string;
    pathTemplate: string;
    defaultData?: any;
}
