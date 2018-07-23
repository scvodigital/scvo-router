/// <reference types="node" />
import * as Url from 'url';
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
    pattern: string | NamedPattern;
    acceptedVerbs?: HttpVerb[];
    queryDelimiter: string;
    queryEquals: string;
    tasks: Array<RouteTaskConfiguration<any> | string>;
    defaultParams: any;
    errorRoute?: string;
    defaultStatusCode?: number;
    debug?: boolean;
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
export declare type HttpVerb = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT';
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
    cookies: CookieMap;
    clearCookies?: CookieMap;
    headers: {
        [key: string]: string;
    };
}
export interface CookieMap {
    [name: string]: Cookie;
}
export interface Cookie {
    value?: string;
    options?: CookieOptions;
}
export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | 'auto';
    encode?: (val: string) => void;
    sameSite?: boolean | string;
}
