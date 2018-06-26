import {RouteTaskConfiguration} from './configuration-interfaces';
import {RendererBase} from './renderer-base';
import {RouteMatch} from './route-match';

/* tslint:disable:no-any */
export class TaskBase {
  constructor(...args: any[]) {}

  async execute(routeMatch: RouteMatch, config: any, renderer?: RendererBase):
      Promise<TaskResult> {
    throw new Error('Not yet implemented');
  }
}

export interface TaskResult {
  command: TaskResultCommand;
  routeName?: string;
}

export enum TaskResultCommand {
  CONTINUE,
  HALT,
  REROUTE
}
/* tslint:enable:no-any */
