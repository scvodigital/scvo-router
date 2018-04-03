import { RouteConfiguration, RouterConfiguration, RouterRequest, RouterResponse } from './interfaces';
import { RouteError } from './route-errors';
export declare class RouteMatch {
    route: RouteConfiguration;
    request: RouterRequest;
    context: RouterConfiguration;
    data: any;
    response: RouterResponse;
    layoutName: string;
    errors: RouteError[];
    constructor(route: RouteConfiguration, request: RouterRequest, context: RouterConfiguration);
    execute(): Promise<RouterResponse>;
    private runTasks();
    private runDestination();
}
