"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var elasticsearch_1 = require("elasticsearch");
var handlebars = require("handlebars");
var hbs = require('nymag-handlebars')();
var map_jsonify_1 = require("./map-jsonify");
/** Class that handles matched routes and gets results */
var RouteMatch = /** @class */ (function () {
    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    function RouteMatch(route, params) {
        this.params = params;
        this.name = '_default';
        this.linkTags = null;
        this.metaTags = null;
        this.pattern = null;
        this.template = '';
        this.queryDelimiter = '&';
        this.queryEquals = '=';
        this.supplimentarySearchTemplates = {};
        this.primaryResponse = null;
        this.supplimentaryResponses = {};
        this.elasticsearchConfig = null;
        // Instance specific properties
        this.compiledTemplate = null;
        // Used to remember which order our supplimentary queries were executed in
        this.orderMap = [];
        this._primaryQuery = null;
        this._supplimentaryQueries = null;
        this._esClient = null;
        // Implement route
        Object.assign(this, route);
        // Compile our template
        this.compiledTemplate = handlebars.compile(this.template);
    }
    Object.defineProperty(RouteMatch.prototype, "rendered", {
        /**
         * Get the rendered view of the results
         */
        get: function () {
            var routeTemplateData = {
                primaryResponse: this.primaryResponse,
                supplimentaryResponse: this.supplimentaryResponses,
                params: this.params
            };
            var output = this.compiledTemplate(routeTemplateData);
            return output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "primaryQuery", {
        // Build our primary query
        get: function () {
            if (!this._primaryQuery) {
                // If we haven't already got this query we need to generate it
                this._primaryQuery = this.primarySearchTemplate.getPrimary(this.params);
            }
            return this._primaryQuery;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "supplimentaryQueries", {
        // Build all supplimentary queries extending our parameters with the primary results we already have
        get: function () {
            var _this = this;
            if (!this._supplimentaryQueries) {
                // If we haven't already got these queries we need to generate them
                // Extend our parameters that will be used when generating supplimentary queries
                // by adding the primary result set
                var supplimentaryParams = this.params;
                supplimentaryParams.primaryResponse = this.primaryResponse;
                this._supplimentaryQueries = { body: [] };
                // Loop through all supplimentary queries
                Object.keys(this.supplimentarySearchTemplates).forEach(function (key, order) {
                    // Elasticsearch return msearch results in order, we need to keep
                    // track of what order our supplimentary results are expected in
                    // to assign them back to the correctly keyed result set
                    _this.orderMap[order] = key;
                    var searchTemplate = _this.supplimentarySearchTemplates[key];
                    // Get both the head and body for our msearch
                    var head = searchTemplate.getHead();
                    var body = searchTemplate.getBody(supplimentaryParams);
                    // Add them to our query array
                    _this._supplimentaryQueries.body.push(head);
                    _this._supplimentaryQueries.body.push(body);
                });
            }
            return this._supplimentaryQueries;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "esClient", {
        get: function () {
            if (!this._esClient) {
                var config = Object.assign({}, this.elasticsearchConfig);
                this._esClient = new elasticsearch_1.Client(config);
            }
            return this._esClient;
        },
        enumerable: true,
        configurable: true
    });
    RouteMatch.prototype.toJSON = function () {
        var templates = map_jsonify_1.MapJsonify(this.supplimentarySearchTemplates);
        var responses = map_jsonify_1.MapJsonify(this.supplimentaryResponses);
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
    };
    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    RouteMatch.prototype.getResults = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Perform our primary search
            _this.esClient.search(_this.primaryQuery, function (err, primaryResponse) {
                if (err)
                    return reject(err);
                // Save the results for use in our rendered template
                _this.primaryResponse = primaryResponse;
                if (Object.keys(_this.supplimentarySearchTemplates).length > 0) {
                    // If we have any supplimentary searches to do, do them
                    _this.esClient.msearch(_this.supplimentaryQueries, function (err, supplimentaryResponses) {
                        if (err)
                            return reject(err);
                        // Loop through each of our supplimentary responses
                        supplimentaryResponses.responses.map(function (supplimentaryResponse, i) {
                            // Find out the name/key of the associated supplimentary search
                            var responseName = _this.orderMap[i];
                            // Save the response to the appropriately named property of our supplimentary responses
                            _this.supplimentaryResponses[responseName] = supplimentaryResponse;
                        });
                        // We're done so let the promise owner know
                        resolve();
                    });
                }
                else {
                    // We don't need to get anything else so let the promise owner know
                    resolve();
                }
            });
        });
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map