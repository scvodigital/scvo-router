"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
/** Class to construct an Elasticsearch query */
var SearchTemplate = (function () {
    /**
     * Create a search template
     * @param {ISearchTemplate} - The JSON required to consturct an Elasticsearch query
     */
    function SearchTemplate(searchTemplate) {
        this.index = null;
        this.type = null;
        this.template = null;
        this.preferredView = null;
        // Instance specific properties
        this.compiledTemplate = null;
        // Implement our JSON 
        Object.assign(this, searchTemplate);
        // Compile our template
        this.compiledTemplate = handlebars.compile(this.template);
    }
    /**
     * Render the query template to a string of JSON
     * @param {any} params - The data to pass into the handlebars template
     * @return {string} A search query rendered as a string of JSON
     */
    SearchTemplate.prototype.renderQuery = function (params) {
        try {
            var query = this.compiledTemplate(params);
            return query;
        }
        catch (err) {
            console.error('Failed to render query', err, 'Template:', this.template, 'Parameters:', params, 'Returning match_all instead');
            return '{ "query": { "match_all": { } } }';
        }
    };
    /**
     * Get the head part of a msearch query
     * @return {ISearchHead} A usable head line for an Elasticsearch msearch
     */
    SearchTemplate.prototype.getHead = function () {
        return {
            index: this.index,
            type: this.type
        };
    };
    /**
     * Get the body part of an msearch query
     * @param {any} params - The data to pass into the handlebars template
     * @return {any} A usable query line for an Elasticsearch msearch
     */
    SearchTemplate.prototype.getBody = function (params) {
        try {
            var query = this.renderQuery(params);
            var parsed = JSON.parse(query);
            return parsed;
        }
        catch (err) {
            console.error('Failed to parse query:', query, 'Returning match_all instead');
            return { query: { match_all: {} } };
        }
    };
    /**
     * Get a standalone query
     * @param {any} params - The data to pass into the handlebars template
     * @return {ISearchQuery} A usable Elasticsearch query payload
     */
    SearchTemplate.prototype.getPrimary = function (params) {
        var parsed = this.getBody(params);
        var payload = {
            index: this.index,
            type: this.type,
            body: parsed
        };
        return payload;
    };
    return SearchTemplate;
}());
exports.SearchTemplate = SearchTemplate;
var SearchTemplateSet = (function () {
    function SearchTemplateSet() {
    }
    return SearchTemplateSet;
}());
exports.SearchTemplateSet = SearchTemplateSet;
//# sourceMappingURL=search-template.js.map