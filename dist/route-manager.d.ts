/// <reference types="node" />
import * as url from 'url';
import 'handlebars-helpers/array';
import 'handlebars-helpers/collection';
import 'handlebars-helpers/date';
import 'handlebars-helpers/html';
import 'handlebars-helpers/index';
import 'handlebars-helpers/logging';
import 'handlebars-helpers/match';
import 'handlebars-helpers/misc';
import 'handlebars-helpers/object';
import 'handlebars-helpers/regex';
import 'handlebars-helpers/url';
import 'handlebars-helpers/code';
import 'handlebars-helpers/comparison';
import 'handlebars-helpers/fs';
import 'handlebars-helpers/i18n';
import 'handlebars-helpers/inflection';
import 'handlebars-helpers/markdown';
import 'handlebars-helpers/math';
import 'handlebars-helpers/number';
import 'handlebars-helpers/path';
import 'handlebars-helpers/string';
import 'handlebars-helpers/utils';
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
