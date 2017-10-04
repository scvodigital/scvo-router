"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var search_template_1 = require("./search-template");
/** Class that handles a route match, implements search templates and gets results */
var Route = (function () {
    /**
     * Create a Route
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    function Route(route) {
        if (route === void 0) { route = null; }
        var _this = this;
        this.linkTags = null;
        this.metaTags = null;
        this.pattern = '';
        this.queryDelimiter = '&';
        this.queryEquals = '=';
        this.template = "\n        {{#and primaryResultSet primaryResultSet.documents}}\n            {{#forEach primaryResultSet.documents}}\n                {{{_view}}}\n            {{/forEach}}\n        {{/and}}";
        this.primarySearchTemplate = null;
        this.supplimentarySearchTemplates = {};
        this.elasticsearchConfig = null;
        if (route) {
            // If given an IRoute, implement it
            Object.assign(this, route);
        }
        // Upgrade our JSON to real classes
        this.primarySearchTemplate = new search_template_1.SearchTemplate(this.primarySearchTemplate);
        Object.keys(this.supplimentarySearchTemplates).forEach(function (key) {
            _this.supplimentarySearchTemplates[key] = new search_template_1.SearchTemplate(_this.supplimentarySearchTemplates[key]);
        });
    }
    return Route;
}());
exports.Route = Route;
//# sourceMappingURL=route.js.map