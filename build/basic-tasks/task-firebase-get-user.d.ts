import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseGetUser extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseGetUserConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskFirebaseGetUserConfiguration {
    appName: string;
    userIdentifier: string;
}
