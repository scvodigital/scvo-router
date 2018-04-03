import {RouterResponse} from './interfaces';
import {RouteMatch} from './route-match';

export abstract class RouterDestination {
  name: string;
  async execute(routeMatch: RouteMatch): Promise<RouterResponse> {
    throw new Error('RouterDestination.execute() Not yet implemented');
  }
  /* tslint:disable */
  constructor(...args: any[]) {};
  /* tslint:enable */
}
