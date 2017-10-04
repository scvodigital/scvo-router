"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var search_template_1 = require("./search-template");
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
            this.primarySearchTemplate = new search_template_1.SearchTemplate(this.primarySearchTemplate);
        }
        else {
            this.primarySearchTemplate = new search_template_1.SearchTemplate({
                type: this.siteKey + '_static-content',
                template: '{ "query": { "term": { "_id": "{{path}}" } } }',
                preferredView: ['details']
            });
        }
        if (this.supplimentarySearchTemplates && this.supplimentarySearchTemplates.length > 0) {
            this.supplimentarySearchTemplates = this.supplimentarySearchTemplates.map(function (searchTemplate) {
                return new search_template_1.SearchTemplate(searchTemplate);
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
//# sourceMappingURL=old.route.js.map