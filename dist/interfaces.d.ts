import { SearchResponse, ConfigOptions } from 'elasticsearch';
export interface IJsonable {
    toJSON(): any;
}
export interface IContext {
    name: string;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    scriptTags: IScriptTag[];
    menus: IMenus;
    routes: IRoutes;
    sass: string;
    template: string;
}
export interface IMenus {
    [name: string]: IMenuItem[];
}
export interface IMenuItem {
    label: string;
    path: string;
    subMenu: IMenuItem[];
}
export interface IRoutes {
    [name: string]: IRoute;
}
export interface IRoute {
    name: string;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    template: string;
    queryDelimiter: string;
    queryEquals: string;
    primarySearchTemplate: ISearchTemplate;
    supplimentarySearchTemplates: ISearchTemplateSet;
    elasticsearchConfig: ConfigOptions;
}
export interface IRouteMatch extends IRoute {
    params: any;
    primaryResponse: SearchResponse<IDocumentResult>;
    supplimentaryResponses: ISearchResponseSet;
    rendered: string;
}
export interface IElasticsearchConfig {
    username: string;
    password: string;
    host: string;
}
export interface ISearchTemplateSet {
    [name: string]: ISearchTemplate;
}
export interface ISearchTemplate {
    index: string;
    type: string;
    template: string;
}
export interface ISearchHead {
    index: string;
    type: string;
}
export interface ISearchQuery {
    index: string;
    type: string;
    body: any;
}
export interface IScriptTag {
    src: string;
    [attribute: string]: string;
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
export interface IPaging {
    from?: number;
    size?: number;
    sort?: any;
}
export interface IDocumentResult {
    Id: string;
    author: string;
    description: string;
    tags: string[];
    title: string;
    og_title: string;
    og_description: string;
    og_image: string;
    views: IViews;
    date_publishes: Date;
    date_expires: Date;
    date_modified: Date;
    date_index_updated: Date;
    text_bag: string;
    json_ld: any;
    geo_info: IGeoInfo[];
}
export interface IViews {
    [name: string]: string;
}
export interface ISearchResponseSet {
    [name: string]: SearchResponse<IDocumentResult>;
}
export interface IGeoInfo {
    title: string;
    description: string;
    geo_point: IGeoPoint;
    primary: boolean;
    address: string;
    postcode: string;
    details: IGeoDetails;
}
export interface IGeoPoint {
    lat: number;
    lon: number;
}
export interface IGeoDetails {
    postcode: string;
    quality: number;
    eastings: number;
    northings: number;
    country: string;
    nhs_ha: string;
    longitude: number;
    latitude: number;
    european_electoral_region: string;
    primary_care_trust: string;
    region: string;
    lsoa: string;
    msoa: string;
    incode: string;
    outcode: string;
    parliamentary_constituency: string;
    admin_district: string;
    parish: string;
    admin_county: string;
    admin_ward: string;
    ccg: string;
    nuts: string;
    codes: {
        admin_district: string;
        admin_county: string;
        admin_ward: string;
        parish: string;
        parliamentary_constituency: string;
        ccg: string;
        nuts: string;
    };
}
