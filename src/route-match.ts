import * as util from 'util';

import { 
    IRouteMatch, INamedPattern, 
    INamedTemplate, IContext, IMenus, IMenuItem,
    IRouterResponse, IRoute, IRouterRequest
} from './interfaces';
import { 
    RouteError, RouteTaskError, 
    RouteDestinationError
} from './route-errors';

export class RouteMatch implements IRouteMatch {
    data: any = {};
    response: IRouterResponse = {
        contentType: 'application/json',
        body: '{}',
        statusCode: 200,
        headers: {},
        cookies: {},
    };
    layoutName: string = 'default';
    errors: RouteError[] = [];

    constructor(public route: IRoute, public request: IRouterRequest, public context: IContext) { 
        this.route.tasks = this.route.tasks || [];
        this.response.cookies = request.cookies;
    }

    public async execute(): Promise<IRouterResponse> {
        try {
            await this.runTasks();
            await this.runDestination();
            return this.response;
        } catch(err) {
            if (!(err instanceof RouteError)) {
                err = new RouteError(err, {
                    statusCode: 500,
                    sourceRoute: this,
                    redirectTo: this.route.errorRoute || null,
                    data: {}
                });
            }
            this.errors.push(err);
            throw err;
        }
    }
   
    private async runTasks(): Promise<void> {
        try {
            //console.log('#### ROUTEMATCH.runTasks() -> Running tasks');
            for (let i = 0; i < this.route.tasks.length; i++) {
                var task = this.route.tasks[i];
                //console.log('#### ROUTEMATCH.runTasks() -> Running task:', task.name, '| type:', task.taskType);
                var routerTask;
                try {
                    routerTask = this.context.routerTasks[task.taskType];
                    this.data[task.name] = await routerTask.execute(this, task);
                } catch(err) {
                    if (!(err instanceof RouteTaskError)) {
                        err = new RouteTaskError(err, {
                            statusCode: 500, 
                            sourceRoute: this, 
                            task: task, 
                            redirectTo: task.errorRoute || this.route.errorRoute || null,
                            data: {}
                        });
                    } else { 
                        err.redirectTo = err.redirectTo || task.errorRoute || this.route.errorRoute || null;
                    }
                    if (err.redirectTo) {
                        throw err;
                    } else {
                        console.log('#### RouteMatch.runTasks() -> Task error (but continuing):', err);
                    }
                }
                //console.log('#### ROUTEMATCH.runTasks() -> Task completed:', task.name);
            }
            //console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
            return;
        } catch(err) {
            if (!(err instanceof RouteError)) {
                err = new RouteError(err, {
                    statusCode: 500, 
                    sourceRoute: this, 
                    redirectTo: this.route.errorRoute || null,
                    data: {}
                });
            } else {
                err.redirectTo = err.redirectTo || this.route.errorRoute || null;
            }
            console.error('#### RouteMatch -> Failed to run tasks:', err);
            throw err;
        }
    }

    private async runDestination(): Promise<void> {
        var routerDestination;
        try {
            routerDestination = this.context.routerDestinations[this.route.destination.destinationType];
            //console.log('#### ROUTEMATCH.runDestination() -> Running destination:', routerDestination.name);
            try {
                var response = await routerDestination.execute(this);
            } catch(err) {
                if (!(err instanceof RouteDestinationError)) {
                    err = new RouteDestinationError(err, {
                        statusCode: 500, 
                        sourceRoute: this, 
                        destination: this.route.destination, 
                        redirectTo: this.route.errorRoute || null,
                        data: {}
                    });
                } else { 
                    err.redirectTo = err.redirectTo || this.route.errorRoute || null;
                }
                throw err;
            }
            //console.log('#### ROUTEMATCH.runDestination() -> Destination completed:');
            Object.assign(this.response, response);
            this.response.cookies = response.cookies; // Overwriting these in case cookies are cleared in the response
        } catch(err) {
            if (!(err instanceof RouteError)) {
                err = new RouteError(err, {
                    statusCode: 500, 
                    sourceRoute: this, 
                    redirectTo: this.route.errorRoute || null,
                    data: {}
                });
            } else {
                err.redirectTo = err.redirectTo || this.route.errorRoute || null;
            }
            console.error('#### RouteMatch -> Failed to run destination:', err);
            throw err;
        }
    }
}
