import { ConfigOptions } from 'elasticsearch';
import { IRoute, ILinkTag, IMetaTag, ISearchTemplateSet, IJsonable } from './interfaces';
import { SearchTemplate } from './search-template';
/** Class that handles a route match, implements search templates and gets results */
export declare class Route implements IRoute, IJsonable {
    name: string;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    metaData: any;
    pattern: string;
    queryDelimiter: string;
    queryEquals: string;
    template: string;
    jsonLdTemplate: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: ISearchTemplateSet;
    elasticsearchConfig: ConfigOptions;
    multipleResults: boolean;
    toJSON(): IRoute;
    /**
     * Create a Route
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route?: IRoute);
}
