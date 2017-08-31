"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteRecognizer = require("route-recognizer");
var es = require("elasticsearch");
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
var route_1 = require("./route");
var route_match_1 = require("./route-match");
helpers({ handlebars: handlebars });
handlebars.registerHelper('log', helpers);
handlebars.registerHelper(helpers.toObject);
var RouteManager = (function () {
    function RouteManager(siteKey, routes, esConfig) {
        var _this = this;
        this.siteKey = siteKey;
        this.esConfig = esConfig;
        this.router = null;
        this.defaultHandler = null;
        this.objectType = null;
        this.slug = null;
        this._esClient = null;
        this.router = new RouteRecognizer();
        Object.keys(routes).forEach(function (routeKey) {
            var route = {
                path: routes[routeKey].pattern,
                handler: new route_1.Route(siteKey, routes[routeKey])
            };
            _this.router.add([route]);
        });
        this.defaultHandler = new route_1.Route(siteKey);
    }
    Object.defineProperty(RouteManager.prototype, "esClient", {
        get: function () {
            if (!this._esClient) {
                this._esClient = new es.Client({
                    host: "https://" + this.esConfig.username + ":" + this.esConfig.password + "@" + this.esConfig.host,
                    log: null
                });
            }
            return this._esClient;
        },
        enumerable: true,
        configurable: true
    });
    RouteManager.prototype.go = function (uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var routes = _this.router.recognize(uri.path);
            var routeMatch = routes && routes.length > 0 ? routes[0] : null;
            var handler = routeMatch ? routeMatch.handler : _this.defaultHandler;
            var query = uri.query || {};
            var params = routeMatch ? routeMatch.params || {} : {};
            var path = uri.path.replace(/\//g, '_');
            path = path === '_' ? '_index' : path;
            params.path = path;
            Object.assign(params, query);
            var primaryQuery = handler.getPrimaryQuery(params);
            _this.esClient.search(primaryQuery).then(function (resultSet) {
                params.primaryResultSet = resultSet;
                var supplimentaryQueries = handler.getSupplimentaryQueries(params);
                if (!supplimentaryQueries) {
                    var routeMatch = new route_match_1.RouteMatch(handler.route, params, resultSet);
                    resolve(routeMatch);
                }
                else {
                    var supplimentaryPayload = { body: supplimentaryQueries };
                    _this.esClient.msearch(supplimentaryPayload).then(function (resultsSets) {
                        var routeMatch = new route_match_1.RouteMatch(handler.route, params, resultSet, resultsSets);
                        resolve(routeMatch);
                    }).catch(function (err) {
                        console.error('Elasticsearch Supplimentary Failed', err, supplimentaryPayload);
                        var emptyResults = {
                            responses: []
                        };
                        supplimentaryQueries.forEach(function (query) {
                            var response = {
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
                        var routeMatch = new route_match_1.RouteMatch(handler.route, params, resultSet, emptyResults);
                    });
                }
            }).catch(function (err) {
                console.error('Elasticsearch Primary Failed', err, primaryQuery);
                reject(err);
            });
        });
    };
    return RouteManager;
}());
exports.RouteManager = RouteManager;
//# sourceMappingURL=route-manager.js.map