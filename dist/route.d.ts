import { SearchTemplate } from './search-template';
import { ILinkTag, IMetaTag } from './interfaces';
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
