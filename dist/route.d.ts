/// <reference types="node" />
import * as url from 'url';
import * as es from 'elasticsearch';
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
export declare class SearchTemplate implements ISearchTemplate {
    template: string;
    type: string;
    preferredView: string[];
    compiled: (obj: any, hbs?: any) => string;
    constructor(searchTemplate: ISearchTemplate);
    getHead(): any;
    getBody(params: any): any;
    getPrimary(params: any): any;
}
export declare class Route implements IRoute {
    siteKey: string;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplate[];
    title: string;
    template: string;
    constructor(siteKey: string, route?: IRoute);
    getPrimaryQuery(params: any): any;
    getSupplimentaryQueries(params: any): any[];
    readonly route: IRoute;
}
export declare class RouteMatch implements IRouteMatch {
    params: any;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplate[];
    title: string;
    template: string;
    primaryResultSet: IDocumentResultSet;
    supplimentaryResultSets: IDocumentResultSet[];
    html: string;
    constructor(routeMatch: IRoute, params: any, primaryResultSet: es.SearchResponse<IDocumentTemplate>, supplimentaryResultsSets?: es.MSearchResponse<IDocumentTemplate>);
}
export declare class DocumentResultSet implements IDocumentResultSet {
    params: any;
    total: number;
    max_score: number;
    paging: Paging;
    documents: IDocumentResult[];
    constructor(resultSet: es.SearchResponse<IDocumentTemplate>, searchTemplate: SearchTemplate, params: any);
}
export declare class DocumentResult implements IDocumentResultBase, IDocumentTemplate {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _sort: any;
    _view: string;
    Id: string;
    author: string;
    description: string;
    lastUpdated: Date;
    tags: string[];
    title: string;
    views: {
        name: string;
        html: string;
    }[];
    publishOn: Date;
    dateIndexUpdated: string;
    text_bag: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    coords: {
        lat: number;
        lon: number;
    };
    constructor(documentResultBase: IDocumentResultBase, hit: IDocumentTemplate, preferredView: string[]);
}
export declare class Paging implements IPaging {
    from: number;
    size: number;
    sort?: any;
    readonly nextFrom: number;
    readonly prevFrom: number;
    constructor(paging: IPaging);
}
export interface IPaging {
    from?: number;
    size?: number;
    sort?: any;
}
export interface IRoutes {
    [routeKey: string]: IRoute;
}
export interface IRoute {
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    primarySearchTemplate?: SearchTemplate;
    supplimentarySearchTemplates?: SearchTemplate[];
    title: string;
    template: string;
}
export interface ISearchTemplate {
    type: string;
    template: string;
    preferredView: string[];
}
export interface IDocumentTemplate {
    Id: string;
    author: string;
    description: string;
    lastUpdated: Date;
    tags: string[];
    title: string;
    views: {
        name: string;
        html: string;
    }[];
    publishOn: Date;
    dateIndexUpdated: string;
    text_bag: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    coords: {
        lat: number;
        lon: number;
    };
}
export interface IDocumentResultSet {
    total: number;
    max_score: number;
    paging: Paging;
    documents: IDocumentResult[];
}
export interface IDocumentResultBase {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _sort?: any;
    _view: string;
}
export interface IDocumentResult extends IDocumentResultBase, IDocumentTemplate {
}
export interface IRouteMatch extends IRoute {
    params: any;
    primaryResultSet: IDocumentResultSet;
    supplimentaryResultSets?: IDocumentResultSet[];
    html: string;
}
export interface IMetaTag {
    content: string;
    name: string;
    [attribute: string]: string;
}
export interface ILinkTag {
    href: string;
    rel: string;
    name?: string;
    type: string;
    [attribute: string]: string;
}
export interface IElasticSearchConfig {
    username: string;
    password: string;
    host: string;
    logging: string;
}
