/// <reference types="route-parser" />
import { RouteConfiguration, RouterRequest } from './configuration-interfaces';
import Route = require('route-parser');
export declare class RegisteredRoute {
    config: RouteConfiguration;
    parsers: Route[];
    private readonly dp;
    constructor(config: RouteConfiguration);
    test(request: RouterRequest): MatchedRoute | null;
}
export interface RegisteredRouteMap {
    [name: string]: RegisteredRoute;
}
export interface MatchedRoute {
    config: RouteConfiguration;
    params: any;
}
