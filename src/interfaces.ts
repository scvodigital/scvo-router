// Module imports
import { SearchResponse, ConfigOptions } from 'elasticsearch';

export interface IJsonable {
    toJSON(): any;
}

export interface IContext {
    name: string;
    domains: string[];
    metaData: any;
    menus: IMenus;
    routes: IRoutes;
    template: string;
    uaId: string;
    templatePartials: IPartials;
    layouts: ILayouts;
    routerTasks: IRouterTasks;
}

export interface ILayouts {
    default: ILayout;
    [name: string]: ILayout;
}

export interface ILayout {
    template: string;
    sections: string[];
    pattern: string;
    contentType: string;
    doNotStripDomains: boolean;
}

export interface IPartials {
    [name: string]: string;
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
    queryDelimiter: string;
    queryEquals: string;
    tasks: IRouteTask[];
    defaultParams: any;
    layouts: IRouteLayouts;
}

export interface IRouteTask {
    name: string;
    taskType: string;
    config: any;
}

export interface IRouteLayouts {
    default: IRouteLayout;
    [name: string]: IRouteLayout;
}

export interface IRouteLayout {
    [section: string]: string;
}

export interface INamedTemplate {
    [name: string]: string;
}

export interface INamedPattern {
    [suffix: string]: string;
}

export interface IRouteMatch {
    route: IRoute;
    params: any;
    data: any;
    response: IRouteResponse;
    context: IContext;
}

export interface IRouteResponse {
    contentType: string;
    contentBody: string;
    statusCode: number;
}

export interface IRouterTasks {
    [name: string]: IRouterTask;
}

export interface IRouterTask {
    name: string;
    execute: (config: any, routeMatch: IRouteMatch) => Promise<any>; 
    new: (...args: any[]) => void;
}
