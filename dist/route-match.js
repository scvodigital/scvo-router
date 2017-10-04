"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var elasticsearch_1 = require("elasticsearch");
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
/** Class that handles matched routes and gets results */
var RouteMatch = /** @class */ (function () {
    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    function RouteMatch(route, params) {
        this.params = params;
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
    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    RouteMatch.prototype.getResults = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Setup an elasticsearch client to use, these details should move to
            var client = new elasticsearch_1.Client(_this.elasticsearchConfig);
            // Perform our primary search
            client.search(_this.primarySearchTemplate.getPrimary).then(function (primaryResponse) {
                // Save the results for use in our rendered template
                _this.primaryResponse = primaryResponse;
                if (Object.keys(_this.supplimentarySearchTemplates).length > 0) {
                    // If we have any supplimentary searches to do, do them
                    client.msearch(_this.supplimentaryQueries).then(function (supplimentaryResponses) {
                        // Loop through each of our supplimentary responses
                        supplimentaryResponses.responses.map(function (supplimentaryResponse, i) {
                            // Find out the name/key of the associated supplimentary search
                            var responseName = _this.orderMap[i];
                            // Save the response to the appropriately named property of our supplimentary responses
                            _this.supplimentaryResponses[responseName] = supplimentaryResponse;
                        });
                        // We're done so let the promise owner know
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    // We don't need to get anything else so let the promise owner know
                    resolve();
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map