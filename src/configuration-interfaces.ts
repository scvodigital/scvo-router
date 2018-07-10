import * as Url from 'url';

/* tslint:disable:no-any */
// Module imports
export interface RouterConfiguration {
  name: string;
  domains: string[];
  metaData: any;
  routes: RouteConfiguration[];
  disasterResponse?: RouterResponse;
}

export interface RouteMap {
  default: RouteConfiguration;
  [name: string]: RouteConfiguration;
}

export interface RouteConfiguration {
  name: string;
  metaData: any;
  pattern: string|NamedPattern;
  acceptedVerbs?: HttpVerb[];
  queryDelimiter: string;
  queryEquals: string;
  tasks: Array<RouteTaskConfiguration<any>|string>;
  defaultParams: any;
  errorRoute?: string;
  defaultStatusCode?: number;
}

export interface RouteTaskConfiguration<T> {
  name: string;
  taskModule: string;
  config: T;
  errorRoute?: string;
  renderer?: string;
}

export interface NamedPattern {
  [suffix: string]: string;
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
/* tslint:enable:no-any */
