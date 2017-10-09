// Module imports
import { Client, SearchResponse, MSearchResponse, ConfigOptions } from 'elasticsearch'; 
import * as handlebars from 'handlebars';
const hbs = require('nymag-handlebars')();

// Internal imports
import { IRouteMatch, ILinkTag, IMetaTag, ISearchTemplate, ISearchResponseSet, ISearchQuery, IDocumentResult } from './interfaces';
import { Route } from './route';
import { SearchTemplate, SearchTemplateSet } from './search-template';
import { MapJsonify } from './map-jsonify';

/** Class that handles matched routes and gets results */
export class RouteMatch implements IRouteMatch {
    name: string = '_default';
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = null;
    template: string = '';
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    primarySearchTemplate: SearchTemplate;
    supplimentarySearchTemplates: SearchTemplateSet = {};
    primaryResponse: SearchResponse<IDocumentResult> = null;
    supplimentaryResponses: ISearchResponseSet = {};
    elasticsearchConfig: ConfigOptions = null;

    /**
     * Get the rendered view of the results
     */
    get rendered(): string {
        var routeTemplateData: any = {
            primaryResponse: this.primaryResponse,
            supplimentaryResponse: this.supplimentaryResponses,
            params: this.params
        };
        var output = this.compiledTemplate(routeTemplateData);
        return output;
    }

    // Instance specific properties
    private compiledTemplate: (obj: any, hbs?: any) => string = null;

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

    public toJSON(): IRouteMatch {
        var templates = MapJsonify<ISearchTemplate>(this.supplimentarySearchTemplates);
        var responses = MapJsonify<SearchResponse<IDocumentResult>>(this.supplimentaryResponses);
        return {
            name: this.name,
            linkTags: this.linkTags,
            metaTags: this.metaTags,
            pattern: this.pattern,
            template: this.template,
            queryDelimiter: this.queryDelimiter,
            queryEquals: this.queryEquals,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            supplimentarySearchTemplates: templates,
            primaryResponse: this.primaryResponse,
            supplimentaryResponses: responses,
            elasticsearchConfig: this.elasticsearchConfig,
            rendered: this.rendered,
            params: this.params
        };
    }

    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    constructor(route: Route, public params: any){
        // Implement route
        Object.assign(this, route);   
        
        // Compile our template
        this.compiledTemplate = handlebars.compile(this.template);       
    }

    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    getResults(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
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

