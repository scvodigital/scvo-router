import * as Url from 'url';
import { RouteError } from './route-errors';

// Module imports
export interface IContext {
    name: string;
    domains: string[];
    metaData: any;
    menus: IMenus;
    routes: IRoutes;
    routerTasks: IRouterTasks;
    routerDestinations: IRouterDestinations;
}

export interface IMenus {
    [name: string]: IMenuItem[];
}

export interface IMenuItem {
    label: string;
    path: string;
    route: string;
    children: IMenuItem[];
    metaData: any;
    level?: number;
    match?: boolean;
}

export interface IMenuItemMatch extends IMenuItem {
    children: IMenuItemMatch[];
    dotPath: string;
    order: number;
    level: number;
    match: boolean;
}

export interface IRoutes {
    [name: string]: IRoute;
}

export interface IRoute {
    name: string;
    metaData: any;
    pattern: string|INamedPattern;
    acceptedVerbs: HttpVerb[] | '*'; 
    queryDelimiter: string;
    queryEquals: string;
    tasks: IRouteTask<any>[];
    destination: IRouteDestination;
    defaultParams: any;
    errorRoute?: string; 
}

export interface IRouteTask<T> {
    name: string;
    taskType: string;
    config: T;
    errorRoute?: string;
}

export interface IRouteDestination {
    destinationType: string;
    config: any;
}

export interface INamedTemplate {
    [name: string]: string;
}

export interface INamedPattern {
    [suffix: string]: string;
}

export interface IRouteMatch {
    route: IRoute;
    request: IRouterRequest;
    data: any;
    response: IRouterResponse;
    context: IContext;
    errors: RouteError[];
}

export interface IRouteRedirect {
    sourceRoute: string;
    destinationRoute: string;
    data: any;
}

export type HttpVerb = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT';

export interface IRouterRequest {
    verb: HttpVerb;
    params: any;
    url: Url.Url;
    body: any;
    cookies: any;
    headers: any;
    fullUrl: string;
}

export interface IRouterResponse {
    contentType: string;
    statusCode: number;
    body: string;
    cookies: { [key: string]: string };
    headers: { [key: string]: string };
}

export interface IRouterTasks {
    [name: string]: IRouterTask;
}

export interface IRouterTask {
    name: string;
    execute: (routeMatch: IRouteMatch, task: IRouteTask<any>) => Promise<any>; 
    new: (...args: any[]) => void;
}

export interface IRouterDestinations {
    [name: string]: IRouterDestination;
}

export interface IRouterDestination {
    name: string;
    execute: (routeMatch: IRouteMatch) => Promise<IRouterResponse>;
    new: (...args: any[]) => void;
}
