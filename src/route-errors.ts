import { 
    IRouteMatch, IRouteTask, IRouteDestination, 
} from './interfaces';

export class RouteError extends Error implements IRouteErrorDetails {
    statusCode: number;
    data: any;
    sourceRoute: IRouteMatch;
    redirectTo?: string;
   
    constructor(baseError: Error, details: IRouteErrorDetails) {
        super(baseError.message);
        Object.setPrototypeOf(this, new.target.prototype);
        Object.assign(this, baseError);
        Object.assign(this, details);
    }
}

export class RouteTaskError extends RouteError implements IRouteTaskErrorDetails {
    task: IRouteTask<any>;
    
    constructor(baseError: Error, details: IRouteTaskErrorDetails) {
        super(baseError, {
            statusCode: details.statusCode,
            data: details.data,
            sourceRoute: details.sourceRoute,
            redirectTo: details.redirectTo || null
        });
        Object.setPrototypeOf(this, new.target.prototype);
        Object.assign(this, baseError);
        this.task = details.task;
    }
}

export class RouteDestinationError extends RouteError implements IRouteDestinationErrorDetails {
    destination: IRouteDestination;

    constructor(baseError: Error, details: IRouteDestinationErrorDetails) {
        super(baseError, {
            statusCode: details.statusCode,
            data: details.data,
            sourceRoute: details.sourceRoute,
            redirectTo: details.redirectTo || null
        });
        Object.setPrototypeOf(this, new.target.prototype);
        Object.assign(this, baseError);
        this.destination = details.destination;
    }
}

export interface IRouteErrorDetails {
    statusCode: number;
    data: any;
    sourceRoute: IRouteMatch;
    redirectTo?: string;
}

export interface IRouteTaskErrorDetails extends IRouteErrorDetails {
    task: IRouteTask<any>;
}

export interface IRouteDestinationErrorDetails extends IRouteErrorDetails {
    destination: IRouteDestination;
}
