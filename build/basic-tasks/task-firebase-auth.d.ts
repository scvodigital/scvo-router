import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseAuth extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseAuthConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskFirebaseAuthConfiguration {
    tokenPath: string;
    appName: string;
    noTokenRoute?: string;
    notAuthenticatedRoute?: string;
}
