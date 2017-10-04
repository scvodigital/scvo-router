import { ConfigOptions } from 'elasticsearch';
import { IRoute, ILinkTag, IMetaTag, ISearchTemplate, ISearchTemplateSet } from './interfaces';
/** Class that handles a route match, implements search templates and gets results */
export declare class Route implements IRoute {
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    queryDelimiter: string;
    queryEquals: string;
    template: string;
    primarySearchTemplate: ISearchTemplate;
    supplimentarySearchTemplates: ISearchTemplateSet;
    elasticsearchConfig: ConfigOptions;
    /**
     * Create a Route
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route?: IRoute);
}
