import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration, CookieOptions } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseGetSession extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseGetSessionConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskFirebaseGetSessionConfiguration {
    tokenPath: string;
    cookieName: string;
    cookieOptions?: CookieOptions;
    appName: string;
}
