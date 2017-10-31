import { SearchResponse, ConfigOptions } from 'elasticsearch';
import { IRouteMatch, ILinkTag, IMetaTag, ISearchResponseSet, ISearchQuery, IDocumentResult, IPaging } from './interfaces';
import { Route } from './route';
import { SearchTemplate, SearchTemplateSet } from './search-template';
/** Class that handles matched routes and gets results */
export declare class RouteMatch implements IRouteMatch {
    params: any;
    name: string;
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    metaData: any;
    pattern: string;
    template: string;
    queryDelimiter: string;
    queryEquals: string;
    jsonLdTemplate: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplateSet;
    primaryResponse: SearchResponse<IDocumentResult>;
    supplimentaryResponses: ISearchResponseSet;
    elasticsearchConfig: ConfigOptions;
    multipleResults: boolean;
    /**
     * Get the rendered view of the results
     */
    readonly rendered: string;
    readonly jsonLd: string;
    private compiledTemplate;
    private compiledJsonLdTemplate;
    private orderMap;
    private _primaryQuery;
    readonly primaryQuery: ISearchQuery;
    private _supplimentaryQueries;
    readonly supplimentaryQueries: any;
    private _esClient;
    private readonly esClient;
    readonly paging: IPaging;
    toJSON(): IRouteMatch;
    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    constructor(route: Route, params: any);
    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    getResults(): Promise<void>;
}
