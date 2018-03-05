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
        contentBody: '{}',
        statusCode: 200
    };
    layoutName: string = 'default';

    constructor(public route: IRoute, public request: IRouterRequest, public context: IContext) { 
        this.route.tasks = this.route.tasks || [];
    }

    public async execute(): Promise<void> {
        try {
            await this.runTasks();
            await this.runDestination();
        } catch(err) {
            this.response.statusCode = 500;
            this.response.contentType = 'application/json';
            this.response.contentBody = JSON.stringify(err, null, 4);
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
            console.log('#### RouteMatch -> Route:', this.route);
            var routerDestination = this.context.routerDestinations[this.route.destination.destinationType];
            this.response = await routerDestination.execute(this);
        } catch(err) {
            console.error('#### RouteMatch -> Failed to run destination:', err);
            throw err;
        }
    }
}
