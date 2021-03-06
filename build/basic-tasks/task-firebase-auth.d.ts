import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration, CookieOptions } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseAuth extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseAuthConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    getNoAuthReturn(routeMatch: RouteMatch, config: TaskFirebaseAuthConfiguration, ...args: any[]): TaskResult;
}
export interface TaskFirebaseAuthConfiguration {
    cookieName: string;
    cookieOptions?: CookieOptions;
    appName: string;
    notAuthenticatedRoute?: string;
}
