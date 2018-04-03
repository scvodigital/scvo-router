import {RouteTaskConfiguration} from './interfaces';
import {RouteMatch} from './route-match';

export abstract class RouterTask {
  name: string;
  /* tslint:disable */
  async execute(routeMatch: RouteMatch, task: RouteTaskConfiguration):
      Promise<any> {
    throw new Error('RouterTask.execute() Not yet implemented');
  }
  constructor(...args: any[]) {}
  /* tslint:enable */
}
