"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
var document_result_1 = require("./document-result");
helpers({ handlebars: handlebars });
var RouteMatch = /** @class */ (function () {
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
        this.primaryResultSet = new document_result_1.DocumentResultSet(primaryResultSet, this.primarySearchTemplate, this.params);
        if (supplimentaryResultsSets && supplimentaryResultsSets.responses) {
            this.supplimentaryResultSets = supplimentaryResultsSets.responses.map(function (resultSet, i) {
                var searchTemplate = _this.supplimentarySearchTemplates[i];
                var documentResultSet = new document_result_1.DocumentResultSet(resultSet, searchTemplate, _this.params);
                return documentResultSet;
            });
        }
        var hbs = handlebars.compile(this.template);
        this.html = hbs(this);
    }
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map