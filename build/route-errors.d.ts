import { RouteDestinationConfiguration, RouteTaskConfiguration } from './interfaces';
import { RouteMatch } from './route-match';
export declare class RouteError extends Error implements RouteErrorDetails {
    statusCode: number;
    data: any;
    sourceRoute: RouteMatch;
    redirectTo: string | null;
    constructor(baseError: Error, details: RouteErrorDetails);
}
export declare class RouteTaskError extends RouteError implements RouteTaskErrorDetails {
    task: RouteTaskConfiguration;
    constructor(baseError: Error, details: RouteTaskErrorDetails);
}
export declare class RouteDestinationError extends RouteError implements RouteDestinationErrorDetails {
    destination: RouteDestinationConfiguration;
    constructor(baseError: Error, details: RouteDestinationErrorDetails);
}
export interface RouteErrorDetails {
    statusCode: number;
    data: any;
    sourceRoute: RouteMatch;
    redirectTo?: string | null;
}
export interface RouteTaskErrorDetails extends RouteErrorDetails {
    task: RouteTaskConfiguration;
}
export interface RouteDestinationErrorDetails extends RouteErrorDetails {
    destination: RouteDestinationConfiguration;
}
