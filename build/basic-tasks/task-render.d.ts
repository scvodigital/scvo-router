import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskRender extends TaskBase {
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskRenderConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    private getTemplate(pathOrTemplate, routeMatch);
}
export interface TaskRenderConfiguration {
    template: string;
    output: 'data' | 'body';
}
