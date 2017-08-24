"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
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
//# sourceMappingURL=search-template.js.map