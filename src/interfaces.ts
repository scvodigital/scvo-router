import * as Url from 'url';

import {RouteError} from './route-errors';
import {RouterDestination} from './router-destination';
import {RouterTask} from './router-task';


/* tslint:disable */
// Module imports
export interface RouterConfiguration {
  name: string;
  domains: string[];
  metaData: any;
  menus: MenuDictionary;
  routes: RouteMap;
  routerTasks: RouterTaskMap;
  routerDestinations: RouterDestinationMap;
}

export interface MenuDictionary { [name: string]: MenuItem[]; }

export interface MenuItem {
  label: string;
  path: string;
  route: string;
  children: MenuItem[];
  metaData: any;
  level?: number;
  match?: boolean;
}

export interface RouteMap { [name: string]: RouteConfiguration; }

export interface RouteConfiguration {
  name: string;
  metaData: any;
  pattern: string|NamedPattern;
  acceptedVerbs: HttpVerb[]|'*';
  queryDelimiter: string;
  queryEquals: string;
  tasks: RouteTaskConfiguration[];
  destination: RouteDestinationConfiguration;
  defaultParams: any;
  errorRoute?: string;
}

export interface RouteTaskConfiguration {
  name: string;
  taskType: string;
  config: any;
  errorRoute?: string;
}

export interface RouteDestinationConfiguration {
  destinationType: string;
  config: any;
}

export interface NamedTemplate { [name: string]: string; }

export interface NamedPattern { [suffix: string]: string; }

export interface RouteRedirect {
  sourceRoute: string;
  destinationRoute: string;
  data: any;
}

export type HttpVerb = 'GET'|'POST'|'HEAD'|'PUT'|'DELETE'|'OPTIONS'|'CONNECT';

export interface RouterRequest {
  verb: HttpVerb;
  params: any;
  url: Url.Url;
  body: any;
  cookies: any;
  headers: any;
  fullUrl: string;
}

export interface RouterResponse {
  contentType: string;
  statusCode: number;
  body: string;
  cookies: {[key: string]: string};
  headers: {[key: string]: string};
}

export interface RouterTaskMap { [name: string]: RouterTask; }

export interface RouterDestinationMap { [name: string]: RouterDestination; }
/* tslint:enable */
