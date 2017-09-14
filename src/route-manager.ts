import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';
import * as RouteRecognizer from 'route-recognizer';
import * as es from 'elasticsearch';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';

import { SearchTemplate } from './search-template';
import { Route, IRoute, IRoutes } from './route';
import { RouteMatch } from './route-match';
import { IDocumentTemplate } from './document-result';

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
            var path = uri.pathname.replace(/\//g, '_');

            path = path === '_' ? '_index' : path;

            console.log('VARS1: query:', query, '| params:', params, '| path:', path);

            try{
                params.path = path;
                params = Object.assign({}, params, query);
            }catch(err){
                params = query;
            }
            
            console.log('VARS2: query:', query, '| params:', params, '| path:', path);
            
            var primaryQuery = handler.getPrimaryQuery(params);

            console.log('PRIMARY QUERY:', JSON.stringify(primaryQuery, null, 4));

            this.esClient.search(primaryQuery).then((resultSet: es.SearchResponse<IDocumentTemplate>) => {
                params.primaryResultSet = resultSet;
                var supplimentaryQueries = handler.getSupplimentaryQueries(params);
                if(!supplimentaryQueries){
                    var routeMatch: RouteMatch = new RouteMatch(handler.route, params, resultSet);
                    resolve(routeMatch);
                }else{
                    var supplimentaryPayload = { body: supplimentaryQueries };

                    console.log('SUPPLIMENTARY PAYLOAD:', JSON.stringify(supplimentaryPayload, null, 4));

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

export interface IElasticSearchConfig {
    username: string;
    password: string;
    host: string;
    logging: string;
}


