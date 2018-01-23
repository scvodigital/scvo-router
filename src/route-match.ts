// Module imports
import { Client, SearchResponse, MSearchResponse, ConfigOptions } from 'elasticsearch';
import * as handlebars from 'handlebars';
const hbs = require('nymag-handlebars')();

// Internal imports
import { 
    IRouteMatch, ILinkTag, IMetaTag, ISearchTemplate, 
    ISearchResponseSet, ISearchQuery, IDocumentResult, 
    IPaging, INamedPattern, INamedTemplate, IContext,
    IMenus, IMenuItem
} from './interfaces';
import { Route } from './route';
import { SearchTemplate, SearchTemplateSet } from './search-template';
import { MapJsonify } from './map-jsonify';
import { Helpers } from './helpers';

/** Class that handles matched routes and gets results */
export class RouteMatch implements IRouteMatch {
    name: string = '_default';
    metaData: any = {};
    pattern: string|INamedPattern = null;
    templates: INamedTemplate = {};
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    headTagsTemplate: string = '';
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplateSet = {};
    primaryResponse: SearchResponse<IDocumentResult> = null;
    supplimentaryResponses: ISearchResponseSet = {};
    elasticsearchConfig: ConfigOptions = null;
    multipleResults: boolean = false;
    defaultParams: any = {};
    javascript: string = '';

    get templateName(): string {
        var templateName = this.params.query ? this.params.query._view || 'default' : 'default';
        if(templateName != 'default' && !this.templates.hasOwnProperty(templateName)){
            templateName = 'default';
        }
        if(!this.templates.hasOwnProperty(templateName)){
            templateName = Object.keys(this.templates)[0];
        }
        return templateName;
    }

    /**
     * Get the rendered view of the results
     */
    get rendered(): string {
        var routeTemplateData: any = {
            primaryResponse: this.primaryResponse,
            supplimentaryResponses: this.supplimentaryResponses,
            params: this.params,
            metaData: this.metaData,
            paging: this.paging,
            context: this.context,
        };
        var output = this.compiledTemplates[this.templateName](routeTemplateData);
        return output;
    }

    get headTags(): string {
        var headTagsTemplateData: any = {
            primaryResponse: this.primaryResponse,
            supplimentaryResponses: this.supplimentaryResponses,
            params: this.params,
            metaData: this.metaData,
            context: this.context,
        };
        var output = this.compiledHeadTagsTemplate(headTagsTemplateData);
        return output;
    }

    get defaultParamsCopy(): any {
        var copy = {};
        Object.assign(copy, this.defaultParams);
        return copy;
    }

    // Instance specific properties
    private compiledTemplates: { [name: string]: (obj: any, hbs?: any) => string } = {};
    private compiledHeadTagsTemplate: (obj: any, hbs?: any) => string = null;

    // Used to remember which order our supplimentary queries were executed in
    private orderMap: string[] = [];

    private _primaryQuery: ISearchQuery = null;
    // Build our primary query
    get primaryQuery() {
        if(!this._primaryQuery){
            // If we haven't already got this query we need to generate it
            this._primaryQuery = this.primarySearchTemplate.getPrimary(this.params);
        }
        return this._primaryQuery;
    }

    private _supplimentaryQueries: any = null;
    // Build all supplimentary queries extending our parameters with the primary results we already have
    get supplimentaryQueries(): any {
        if(!this._supplimentaryQueries){
            // If we haven't already got these queries we need to generate them

            // Extend our parameters that will be used when generating supplimentary queries
            // by adding the primary result set
            var supplimentaryParams = this.params;
            supplimentaryParams.primaryResponse = this.primaryResponse;

            this._supplimentaryQueries = { body: [] };

            // Loop through all supplimentary queries
            Object.keys(this.supplimentarySearchTemplates).forEach((key: string, order: number) => {
                // Elasticsearch return msearch results in order, we need to keep
                // track of what order our supplimentary results are expected in
                // to assign them back to the correctly keyed result set
                this.orderMap[order] = key;

                var searchTemplate = this.supplimentarySearchTemplates[key];

                // Get both the head and body for our msearch
                var head = searchTemplate.getHead();
                var body = searchTemplate.getBody(supplimentaryParams);

                // Add them to our query array
                this._supplimentaryQueries.body.push(head);
                this._supplimentaryQueries.body.push(body);
            });
        }
        return this._supplimentaryQueries;
    }

    private _esClient: Client = null;
    private get esClient(): Client {
        if(!this._esClient){
            var config = Object.assign({}, this.elasticsearchConfig);
            this._esClient = new Client(config);
        }
        return this._esClient;
    }

    public get paging(): IPaging {
        var from = this.primaryQuery.body.from || 0;
        var size = this.primaryQuery.body.size || 10;
        var sort = this.primaryQuery.body.sort || null;
        var totalResults = this.primaryResponse.hits.total || 0;
        var totalPages = Math.ceil(totalResults / size);
        var currentPage = Math.floor(from / size) + 1;

        var nextPage = currentPage < totalPages ? Math.floor(currentPage + 1) : null;
        var prevPage = currentPage > 1 ? Math.floor(currentPage - 1) : null;

        // Setup an array (range) of 10 numbers surrounding our current page
        var pageRange = Array.from(new Array(9).keys(), (p, i) => i + (currentPage - 4));

        // Move range forward until none of the numbers are less than 1
        var rangeMin = pageRange[0];
        var positiveShift = rangeMin < 1 ? 1 - rangeMin : 0;
        pageRange = pageRange.map(p => p + positiveShift);

        // Move range backwards until none of the numbers are greater than totalPages
        var rangeMax = pageRange[pageRange.length - 1];
        var negativeShift = rangeMax > totalPages ? rangeMax - totalPages : 0;
        pageRange = pageRange.map(p => p - negativeShift);

        // Prune everything that appears outside of our 1 to totalPages range
        pageRange = pageRange.filter(p => p >= 1 && p <= totalPages);

        var pages = [];

        pageRange.forEach((page: number) => {
            var distance: number = Math.abs(currentPage - page);
            pages.push({
                pageNumber: Math.floor(page),
                distance: distance,
            });
        });

        var paging = {
            from: from,
            size: size,
            sort: sort,
            totalResults: totalResults,

            totalPages: totalPages,
            currentPage: currentPage,

            nextPage: nextPage,
            prevPage: prevPage,

            pageRange: pages
        };
        return paging;
    }

    public toJSON(): IRouteMatch {
        var templates = MapJsonify<ISearchTemplate>(this.supplimentarySearchTemplates);
        var responses = MapJsonify<SearchResponse<IDocumentResult>>(this.supplimentaryResponses);
        return {
            name: this.name,
            metaData: this.metaData,
            pattern: this.pattern,
            templates: this.templates,
            templateName: this.templateName,
            queryDelimiter: this.queryDelimiter,
            queryEquals: this.queryEquals,
            headTagsTemplate: this.headTagsTemplate,
            headTags: this.headTags,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            supplimentarySearchTemplates: templates,
            primaryResponse: this.primaryResponse,
            supplimentaryResponses: responses,
            elasticsearchConfig: this.elasticsearchConfig,
            rendered: this.rendered,
            params: this.params,
            multipleResults: this.multipleResults,
            paging: this.paging,
            defaultParams: this.defaultParams,
            javascript: this.javascript,
            context: this.context,
        };
    }

    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    constructor(route: Route, public params: any, public context: IContext){
        // Implement route
        Object.assign(this, route);

        Helpers.register(handlebars);
        Object.keys(context.templatePartials).forEach((name: string) => {
            handlebars.registerPartial(name, context.templatePartials[name]);
        });

        // Compile our template
        Object.keys(this.templates).forEach((name: string) => {
            this.compiledTemplates[name] = handlebars.compile(this.templates[name]);
        });
        this.compiledHeadTagsTemplate = handlebars.compile(this.headTagsTemplate);

        Object.keys(this.context.menus).forEach((name: string) => {
            this.context.menus[name] = this.traverseMenu(this.context.menus[name]);
        });
    }

    traverseMenu(menuItems: IMenuItem[], level: number = 0): IMenuItem[] {
        menuItems.forEach((menuItem) => {
            var pattern = new RegExp(menuItem.route, 'i');
            menuItem.match = pattern.test(this.params.uri.path);
            menuItem.level = level;
            if (menuItem.children) {
                menuItem.children = this.traverseMenu(menuItem.children, level + 1);
            }
        });

        return menuItems;
    }

    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    getResults(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            //console.log('#### ROUTE NAME:', this.name, '####');
            // Perform our primary search
            this.esClient.search(this.primaryQuery, (err: any, primaryResponse: SearchResponse<IDocumentResult>) => {
                if(err) return reject(err);
                // Save the results for use in our rendered template
                this.primaryResponse = primaryResponse;

                if(Object.keys(this.supplimentarySearchTemplates).length > 0){
                    // If we have any supplimentary searches to do, do them
                    this.esClient.msearch(this.supplimentaryQueries, (err: any, supplimentaryResponses: MSearchResponse<IDocumentResult>) => {
                        if(err) return reject(err);
                        // Loop through each of our supplimentary responses
                        supplimentaryResponses.responses.map((supplimentaryResponse: SearchResponse<IDocumentResult>, i: number) => {
                            // Find out the name/key of the associated supplimentary search
                            var responseName = this.orderMap[i];
                            // Save the response to the appropriately named property of our supplimentary responses
                            this.supplimentaryResponses[responseName] = supplimentaryResponse;
                        });
                        // We're done so let the promise owner know
                        resolve();
                    });
                }else{
                    // We don't need to get anything else so let the promise owner know
                    resolve();
                }
            });
        });
    }
}
