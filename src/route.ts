import * as util from 'util';
import * as url from 'url';
import * as querystring from 'querystring';
import * as RouteRecognizer from 'route-recognizer';
import * as es from 'elasticsearch';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';

import { RouterManager } from 'scvo-router';

helpers({ handlebars: handlebars });

export class RouteManager {
    router: any = null;
    defaultHandler: Route = null;
    objectType: string = null;
    slug: string = null;

    private _esClient: es.Client = null;
    private get esClient(): es.Client {
        if(!this._esClient){
            this._esClient = new es.Client({
                host: `https://${this.esConfig.username}:${this.esConfig.password}@${this.esConfig.host}`,
                log: null     
            });
        }
        return this._esClient;
    }

    constructor(public siteKey: string, routes: IRoutes, private esConfig: IElasticSearchConfig){
        this.router = new (<any>RouteRecognizer)();
        Object.keys(routes).forEach((routeKey) => {
            var route = {
                path: routes[routeKey].pattern,
                handler: new Route(siteKey, routes[routeKey])
            };
            this.router.add([route]);
        });
        this.defaultHandler = new Route(siteKey);
    }

    go(uri: url.Url): Promise<RouteMatch>{
        return new Promise((resolve, reject) => {
            var routes: RouteRecognizer.Results = this.router.recognize(uri.path);
            var routeMatch = routes && routes.length > 0 ? routes[0] : null;
            var handler: Route = routeMatch ? <Route>routeMatch.handler : this.defaultHandler;
            
            var query = uri.query || {};
            var params = routeMatch ? routeMatch.params || {} : {};
            var path = uri.path.replace(/\//g, '_');
            path = path === '_' ? '_index' : path;
            params.path = path;
            Object.assign(params, query);

            var primaryQuery = handler.getPrimaryQuery(params);
            this.esClient.search(primaryQuery).then((resultSet: es.SearchResponse<IDocumentTemplate>) => {
                params.primaryResultSet = resultSet;
                var supplimentaryQueries = handler.getSupplimentaryQueries(params);
                if(!supplimentaryQueries){
                    var routeMatch: RouteMatch = new RouteMatch(handler.route, params, resultSet);
                    resolve(routeMatch);
                }else{
                    var supplimentaryPayload = { body: supplimentaryQueries };
                    this.esClient.msearch(supplimentaryPayload).then((resultsSets: es.MSearchResponse<IDocumentTemplate>) => {
                        var routeMatch: RouteMatch = new RouteMatch(handler.route, params, resultSet, resultsSets);
                        resolve(routeMatch);
                    }).catch((err) => {
                        console.error('Elasticsearch Supplimentary Failed', err, supplimentaryPayload);
                        var emptyResults: es.MSearchResponse<IDocumentTemplate> = {
                            responses: []
                        };
                        supplimentaryQueries.forEach((query) => {
                            var response: es.SearchResponse<IDocumentTemplate> = {
                                _scroll_id: null,
                                _shards: {
                                    failed: 1,
                                    successful: 0,
                                    total: 1       
                                },
                                aggregations: null,
                                timed_out: false,
                                took: 0,
                                hits: {
                                    hits: [],
                                    max_score: 0,
                                    total: 0
                                }
                            };

                            emptyResults.responses.push(response);
                        });
                        var routeMatch: RouteMatch = new RouteMatch(handler.route, params, resultSet, emptyResults);
                    });
                }
            }).catch((err) => {
                console.error('Elasticsearch Primary Failed', err, primaryQuery);
                reject(err);      
            });
        });
    }
}

export class SearchTemplate implements ISearchTemplate {
    template: string = '';
    type: string = '';
    preferredView: string[] = ['details'];
    compiled: (obj: any, hbs?: any) => string = null;

    constructor(searchTemplate: ISearchTemplate){
        Object.assign(this, searchTemplate);
        this.compiled = handlebars.compile(this.template);
    }

    getHead(): any {
        return { index: 'web-content', type: this.type };
    }

    getBody(params: any): any {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        return parsed;
    }

    getPrimary(params: any): any {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        var payload = {
            index: 'web-content',
            type: this.type,
            body: parsed
        };
        return payload;
    }
}

export class Route implements IRoute {
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = '';
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: SearchTemplate[] = null;
    title: string;
    template: string = `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}
    `;

    constructor(public siteKey: string, route?: IRoute){
        if(route){
            Object.assign(this, route);
        }

        if(this.primarySearchTemplate){
            this.primarySearchTemplate = new SearchTemplate(this.primarySearchTemplate);
        }else{
            this.primarySearchTemplate = new SearchTemplate({
                type: this.siteKey + '_static-content',
                template: '{ "query": { "term": { "_id": "{{path}}" } } }',
                preferredView: ['details']
            });
        }

        if(this.supplimentarySearchTemplates && this.supplimentarySearchTemplates.length > 0){
            this.supplimentarySearchTemplates = this.supplimentarySearchTemplates.map((searchTemplate) => {
                return new SearchTemplate(searchTemplate);
            });
        }
    }

    getPrimaryQuery(params: any){
        var query = this.primarySearchTemplate.getPrimary(params);
        return query;
    }

    getSupplimentaryQueries(params: any){
        if(this.supplimentarySearchTemplates){
            var queries = [];
            this.supplimentarySearchTemplates.forEach((searchTemplate: SearchTemplate) => {
                var head = searchTemplate.getHead();
                var body = searchTemplate.getBody(params);
                queries.push(head);
                queries.push(body);
            });
            return queries;
        }else{
            return null;
        }
    }

    get route(): IRoute{
        var route: IRoute = {
            linkTags: this.linkTags,
            metaTags: this.metaTags,
            pattern: this.pattern,
            primarySearchTemplate: this.primarySearchTemplate,
            supplimentarySearchTemplates: this.supplimentarySearchTemplates,
            title: this.title,
            template: this.template
        };
        return route;
    }
}

export class RouteMatch implements IRouteMatch {
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = null;
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: SearchTemplate[] = null;
    title: string = '';   
    template: string = '';
    primaryResultSet: IDocumentResultSet = null;
    supplimentaryResultSets: IDocumentResultSet[] = [];
    html: string = '';

    constructor(routeMatch: IRoute, public params: any, primaryResultSet: es.SearchResponse<IDocumentTemplate>, supplimentaryResultsSets?: es.MSearchResponse<IDocumentTemplate>){
        Object.assign(this, routeMatch);

        this.primaryResultSet = new DocumentResultSet(primaryResultSet, this.primarySearchTemplate, this.params);

        if(supplimentaryResultsSets && supplimentaryResultsSets.responses){
            this.supplimentaryResultSets = supplimentaryResultsSets.responses.map((resultSet: es.SearchResponse<IDocumentTemplate>, i: number) => {
                var searchTemplate = this.supplimentarySearchTemplates[i];
                var documentResultSet: IDocumentResultSet = new DocumentResultSet(resultSet, searchTemplate, this.params);
                return documentResultSet;
            });
        }

        var hbs = handlebars.compile(this.template);
        this.html = hbs(this);
    }
}

export class DocumentResultSet implements IDocumentResultSet {
    total: number = 0;
    max_score: number = 0;
    paging: Paging = null;
    documents: IDocumentResult[] = [];

    constructor(resultSet: es.SearchResponse<IDocumentTemplate>, searchTemplate: SearchTemplate, public params: any){
        var query: any = searchTemplate.getBody(this.params);
        var preferredView: string[] = searchTemplate.preferredView;
        var paging: Paging = new Paging({
            from: query.from || null,
            size: query.size || null,
            sort: query.sort || null
        });
        this.total = resultSet.hits.total;
        this.max_score = resultSet.hits.max_score;
        this.paging = paging;
        this.documents = resultSet.hits.hits.map((hit) => {
            var documentResultBase: IDocumentResultBase = {
                _index: hit._index,
                _type: hit._type,
                _id: hit._id,
                _score: hit._score,
                _sort: (<any>hit)._sort || null,
                _view: ''
            };
            var documentResult: DocumentResult = new DocumentResult(documentResultBase, hit._source, preferredView);

            return documentResult;
        }); 
    }
}

export class DocumentResult implements IDocumentResultBase, IDocumentTemplate {
    _index: string = null;
    _type: string = null;
    _id: string = null;
    _score: number = null;
    _sort: any = null;
    _view: string = null;
    Id: string = null;
    author: string = null;
    description: string = null;
    lastUpdated: Date = null;
    tags: string[] = null;
    title: string = null;
    views: {
        name: string;
        html: string;       
    }[] = null;
    publishOn: Date = null;
    dateIndexUpdated: string = null;
    text_bag: string = null;
    og_title: string = null;
    og_description: string = null;
    og_image: string = null;
    json_ld: string = null;
    coords: { 
        lat: number; 
        lon: number 
    } = null;


    constructor(documentResultBase: IDocumentResultBase, hit: IDocumentTemplate, preferredView: string[]) {
        Object.assign(this, documentResultBase);
        Object.assign(this, hit);
       
        if(preferredView.indexOf('details') === -1){
            preferredView.push('details');
        }

        if(this.views.length > 0){
            for(var v = 0; v < preferredView.length; v++){
                var name = preferredView[v];
                var found = this.views.filter((view) => {
                    return view.name === name;
                });
                if(found && found.length > 0){
                    this._view = found[0].html;
                    break;
                }
            }
    
            if(!this._view){
                this._view = this.views[0].html;
            }
        }else{
            this._view = 'No view specified';
        }
    }
}

export class Paging implements IPaging {
    from: number = 0;
    size: number = 10;
    sort?: any = null;

    get nextFrom(): number {
        return this.from + this.size;
    }

    get prevFrom(): number {
        var prev = this.from - this.size;
        return prev >= 0 ? prev : 0;
    }

    constructor(paging: IPaging){
        Object.assign(this, paging);
    }
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

export interface IDocumentTemplate{
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
        lon: number 
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

export const domainMap = {
    ['localhost']: 'test-site',
    ['127.0.0.1']: 'test-site',
    ['beta.scvo.org.uk']: 'test-site'
}

