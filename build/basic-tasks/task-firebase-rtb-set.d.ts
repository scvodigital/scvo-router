import * as firebase from 'firebase-admin';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskFirebaseRtbSet extends TaskBase {
    private apps;
    constructor(apps: {
        [name: string]: firebase.app.App;
    });
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskFirebaseRtbSetConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
}
export interface TaskFirebaseRtbSetConfiguration {
    appName: string;
    pathTemplate: string;
    dataTemplate: string;
    parseJson?: boolean;
    setOrUpdate: string;
}
export interface FirebaseRtbSetResponse {
    setOrUpdate: string;
    path: string;
    data: any;
}
