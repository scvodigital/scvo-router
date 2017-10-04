import * as es from 'elasticsearch';
import { SearchTemplate } from './search-template';
import { DocumentResultSet, IDocumentTemplate } from './document-result';
import { IRoute } from './route';
import { ILinkTag, IMetaTag } from './interfaces';
export declare class RouteMatch implements IRouteMatch {
    params: any;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplate[];
    title: string;
    template: string;
    primaryResultSet: DocumentResultSet;
    supplimentaryResultSets: DocumentResultSet[];
    html: string;
    constructor(routeMatch: IRoute, params: any, primaryResultSet: es.SearchResponse<IDocumentTemplate>, supplimentaryResultsSets?: es.MSearchResponse<IDocumentTemplate>);
}
export interface IRouteMatch extends IRoute {
    params: any;
    primaryResultSet: DocumentResultSet;
    supplimentaryResultSets?: DocumentResultSet[];
    html: string;
}
