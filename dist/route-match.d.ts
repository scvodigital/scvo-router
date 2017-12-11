import { SearchResponse, ConfigOptions } from 'elasticsearch';
import { IRouteMatch, ISearchResponseSet, ISearchQuery, IDocumentResult, IPaging, INamedPattern, INamedTemplate, IContext } from './interfaces';
import { Route } from './route';
import { SearchTemplate, SearchTemplateSet } from './search-template';
/** Class that handles matched routes and gets results */
export declare class RouteMatch implements IRouteMatch {
    params: any;
    context: IContext;
    name: string;
    metaData: any;
    pattern: string | INamedPattern;
    templates: INamedTemplate;
    queryDelimiter: string;
    queryEquals: string;
    headTagsTemplate: string;
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplateSet;
    primaryResponse: SearchResponse<IDocumentResult>;
    supplimentaryResponses: ISearchResponseSet;
    elasticsearchConfig: ConfigOptions;
    multipleResults: boolean;
    defaultParams: any;
    javascript: string;
    readonly templateName: string;
    /**
     * Get the rendered view of the results
     */
    readonly rendered: string;
    readonly headTags: string;
    readonly defaultParamsCopy: any;
    private compiledTemplates;
    private compiledHeadTagsTemplate;
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
    constructor(route: Route, params: any, context: IContext);
    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    getResults(): Promise<void>;
}
