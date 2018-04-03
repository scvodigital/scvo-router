import { RouteTaskConfiguration } from './interfaces';
import { RouteMatch } from './route-match';
export declare abstract class RouterTask {
    name: string;
    execute(routeMatch: RouteMatch, task: RouteTaskConfiguration): Promise<any>;
    constructor(...args: any[]);
}
