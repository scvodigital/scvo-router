import * as Url from 'url';

// Module imports
export interface IContext {
    name: string;
    domains: string[];
    metaData: any;
    menus: IMenus;
    routes: IRoutes;
    template: string;
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
    tasks: IRouteTask[];
    destination: IRouteDestination;
    defaultParams: any;
}

export interface IRouteTask {
    name: string;
    taskType: string;
    config: any;
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
    execute: (routeMatch: IRouteMatch, config: any) => Promise<any>; 
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
