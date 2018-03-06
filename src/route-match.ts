import * as util from 'util';

import { 
    IRouteMatch, INamedPattern, 
    INamedTemplate, IContext, IMenus, IMenuItem,
    IRouterResponse, IRoute, IRouterRequest
} from './interfaces';

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

    constructor(public route: IRoute, public request: IRouterRequest, public context: IContext) { 
        this.route.tasks = this.route.tasks || [];
        this.response.cookies = request.cookies;
    }

    public async execute(): Promise<void> {
        try {
            await this.runTasks();
            await this.runDestination();
        } catch(err) {
            this.response.statusCode = 500;
            this.response.contentType = 'application/json';
            this.response.body = JSON.stringify(err, null, 4);
        }
        return;
    }
   
    private async runTasks(): Promise<void> {
        try {
            //console.log('#### ROUTEMATCH.runTasks() -> Running tasks');
            for (let i = 0; i < this.route.tasks.length; i++) {
                var task = this.route.tasks[i];
                //console.log('#### ROUTEMATCH.runTasks() -> Running task:', task.name, '| type:', task.taskType);
                var routerTask = this.context.routerTasks[task.taskType];
                this.data[task.name] = await routerTask.execute(this, task.config);
                //console.log('#### ROUTEMATCH.runTasks() -> Task completed:', task.name);
            }
            //console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
            return;
        } catch(err) {
            console.error('#### RouteMatch -> Failed to run tasks:', err);
            throw err;
        }
    }

    private async runDestination(): Promise<void> {
        try {
            var routerDestination = this.context.routerDestinations[this.route.destination.destinationType];
            //console.log('#### ROUTEMATCH.runDestination() -> Running destination:', routerDestination.name);
            var response = await routerDestination.execute(this);
            //console.log('#### ROUTEMATCH.runDestination() -> Destination completed:');
            Object.assign(this.response, response);
            this.response.cookies = response.cookies; // Overwriting these in case cookies are cleared in the response
        } catch(err) {
            console.error('#### RouteMatch -> Failed to run destination:', err);
            throw err;
        }
    }
}
