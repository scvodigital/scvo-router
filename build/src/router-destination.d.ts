import { RouterResponse } from './interfaces';
import { RouteMatch } from './route-match';
export declare abstract class RouterDestination {
    name: string;
    execute(routeMatch: RouteMatch): Promise<RouterResponse>;
    constructor(...args: any[]);
}
