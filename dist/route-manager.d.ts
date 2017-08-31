/// <reference types="node" />
import * as url from 'url';
import { Route, IRoutes } from './route';
import { RouteMatch } from './route-match';
export declare class RouteManager {
    siteKey: string;
    private esConfig;
    router: any;
    defaultHandler: Route;
    objectType: string;
    slug: string;
    private _esClient;
    private readonly esClient;
    constructor(siteKey: string, routes: IRoutes, esConfig: IElasticSearchConfig);
    go(uri: url.Url): Promise<RouteMatch>;
}
export interface IElasticSearchConfig {
    username: string;
    password: string;
    host: string;
    logging: string;
}
