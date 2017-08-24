"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteRecognizer = require("route-recognizer");
var es = require("elasticsearch");
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
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
                handler: new Route(siteKey, routes[routeKey])
            };
            _this.router.add([route]);
        });
        this.defaultHandler = new Route(siteKey);
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
                    var routeMatch = new RouteMatch(handler.route, params, resultSet);
                    resolve(routeMatch);
                }
                else {
                    var supplimentaryPayload = { body: supplimentaryQueries };
                    _this.esClient.msearch(supplimentaryPayload).then(function (resultsSets) {
                        var routeMatch = new RouteMatch(handler.route, params, resultSet, resultsSets);
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
                        var routeMatch = new RouteMatch(handler.route, params, resultSet, emptyResults);
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
var SearchTemplate = (function () {
    function SearchTemplate(searchTemplate) {
        this.template = '';
        this.type = '';
        this.preferredView = ['details'];
        this.compiled = null;
        Object.assign(this, searchTemplate);
        this.compiled = handlebars.compile(this.template);
    }
    SearchTemplate.prototype.getHead = function () {
        return { index: 'web-content', type: this.type };
    };
    SearchTemplate.prototype.getBody = function (params) {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        return parsed;
    };
    SearchTemplate.prototype.getPrimary = function (params) {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        var payload = {
            index: 'web-content',
            type: this.type,
            body: parsed
        };
        return payload;
    };
    return SearchTemplate;
}());
exports.SearchTemplate = SearchTemplate;
var Route = (function () {
    function Route(siteKey, route) {
        this.siteKey = siteKey;
        this.linkTags = null;
        this.metaTags = null;
        this.pattern = '';
        this.primarySearchTemplate = null;
        this.supplimentarySearchTemplates = null;
        this.template = "\n        {{#and primaryResultSet primaryResultSet.documents}}\n            {{#forEach primaryResultSet.documents}}\n                {{{_view}}}\n            {{/forEach}}\n        {{/and}}\n    ";
        if (route) {
            Object.assign(this, route);
        }
        if (this.primarySearchTemplate) {
            this.primarySearchTemplate = new SearchTemplate(this.primarySearchTemplate);
        }
        else {
            this.primarySearchTemplate = new SearchTemplate({
                type: this.siteKey + '_static-content',
                template: '{ "query": { "term": { "_id": "{{path}}" } } }',
                preferredView: ['details']
            });
        }
        if (this.supplimentarySearchTemplates && this.supplimentarySearchTemplates.length > 0) {
            this.supplimentarySearchTemplates = this.supplimentarySearchTemplates.map(function (searchTemplate) {
                return new SearchTemplate(searchTemplate);
            });
        }
    }
    Route.prototype.getPrimaryQuery = function (params) {
        var query = this.primarySearchTemplate.getPrimary(params);
        return query;
    };
    Route.prototype.getSupplimentaryQueries = function (params) {
        if (this.supplimentarySearchTemplates) {
            var queries = [];
            this.supplimentarySearchTemplates.forEach(function (searchTemplate) {
                var head = searchTemplate.getHead();
                var body = searchTemplate.getBody(params);
                queries.push(head);
                queries.push(body);
            });
            return queries;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(Route.prototype, "route", {
        get: function () {
            var route = {
                linkTags: this.linkTags,
                metaTags: this.metaTags,
                pattern: this.pattern,
                primarySearchTemplate: this.primarySearchTemplate,
                supplimentarySearchTemplates: this.supplimentarySearchTemplates,
                title: this.title,
                template: this.template
            };
            return route;
        },
        enumerable: true,
        configurable: true
    });
    return Route;
}());
exports.Route = Route;
var RouteMatch = (function () {
    function RouteMatch(routeMatch, params, primaryResultSet, supplimentaryResultsSets) {
        var _this = this;
        this.params = params;
        this.linkTags = null;
        this.metaTags = null;
        this.pattern = null;
        this.primarySearchTemplate = null;
        this.supplimentarySearchTemplates = null;
        this.title = '';
        this.template = '';
        this.primaryResultSet = null;
        this.supplimentaryResultSets = [];
        this.html = '';
        Object.assign(this, routeMatch);
        this.primaryResultSet = new DocumentResultSet(primaryResultSet, this.primarySearchTemplate, this.params);
        if (supplimentaryResultsSets && supplimentaryResultsSets.responses) {
            this.supplimentaryResultSets = supplimentaryResultsSets.responses.map(function (resultSet, i) {
                var searchTemplate = _this.supplimentarySearchTemplates[i];
                var documentResultSet = new DocumentResultSet(resultSet, searchTemplate, _this.params);
                return documentResultSet;
            });
        }
        var hbs = handlebars.compile(this.template);
        this.html = hbs(this);
    }
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
var DocumentResultSet = (function () {
    function DocumentResultSet(resultSet, searchTemplate, params) {
        this.params = params;
        this.total = 0;
        this.max_score = 0;
        this.paging = null;
        this.documents = [];
        var query = searchTemplate.getBody(this.params);
        var preferredView = searchTemplate.preferredView;
        var paging = new Paging({
            from: query.from || null,
            size: query.size || null,
            sort: query.sort || null
        });
        this.total = resultSet.hits.total;
        this.max_score = resultSet.hits.max_score;
        this.paging = paging;
        this.documents = resultSet.hits.hits.map(function (hit) {
            var documentResultBase = {
                _index: hit._index,
                _type: hit._type,
                _id: hit._id,
                _score: hit._score,
                _sort: hit._sort || null,
                _view: ''
            };
            var documentResult = new DocumentResult(documentResultBase, hit._source, preferredView);
            return documentResult;
        });
    }
    return DocumentResultSet;
}());
exports.DocumentResultSet = DocumentResultSet;
var DocumentResult = (function () {
    function DocumentResult(documentResultBase, hit, preferredView) {
        this._index = null;
        this._type = null;
        this._id = null;
        this._score = null;
        this._sort = null;
        this._view = null;
        this.Id = null;
        this.author = null;
        this.description = null;
        this.lastUpdated = null;
        this.tags = null;
        this.title = null;
        this.views = null;
        this.publishOn = null;
        this.dateIndexUpdated = null;
        this.text_bag = null;
        this.og_title = null;
        this.og_description = null;
        this.og_image = null;
        this.json_ld = null;
        this.coords = null;
        Object.assign(this, documentResultBase);
        Object.assign(this, hit);
        if (preferredView.indexOf('details') === -1) {
            preferredView.push('details');
        }
        if (this.views.length > 0) {
            for (var v = 0; v < preferredView.length; v++) {
                var name = preferredView[v];
                var found = this.views.filter(function (view) {
                    return view.name === name;
                });
                if (found && found.length > 0) {
                    this._view = found[0].html;
                    break;
                }
            }
            if (!this._view) {
                this._view = this.views[0].html;
            }
        }
        else {
            this._view = 'No view specified';
        }
    }
    return DocumentResult;
}());
exports.DocumentResult = DocumentResult;
var Paging = (function () {
    function Paging(paging) {
        this.from = 0;
        this.size = 10;
        this.sort = null;
        Object.assign(this, paging);
    }
    Object.defineProperty(Paging.prototype, "nextFrom", {
        get: function () {
            return this.from + this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paging.prototype, "prevFrom", {
        get: function () {
            var prev = this.from - this.size;
            return prev >= 0 ? prev : 0;
        },
        enumerable: true,
        configurable: true
    });
    return Paging;
}());
exports.Paging = Paging;
//# sourceMappingURL=route.js.map