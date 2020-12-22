"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var elasticsearch_1 = require("elasticsearch");
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskElasticsearch = /** @class */ (function (_super) {
    __extends(TaskElasticsearch, _super);
    function TaskElasticsearch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskElasticsearch.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, connectionString, configOptions, client, data, reroute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        return [4 /*yield*/, renderer.render(config.connectionStringTemplate, routeMatch)];
                    case 1:
                        connectionString = _a.sent();
                        configOptions = { host: connectionString, apiVersion: '5.6' };
                        Object.assign(configOptions, config.elasticsearchConfig || {});
                        client = new elasticsearch_1.Client(configOptions);
                        if (!Array.isArray(config.queryTemplates)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.multiQuery(client, config, routeMatch, renderer)];
                    case 2:
                        data = _a.sent();
                        Object.keys(data).forEach(function (key) {
                            var routerSearchResponse = data[key];
                            reroute = routerSearchResponse.reroute || reroute;
                        });
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.singleQuery(client, config, routeMatch, renderer)];
                    case 4:
                        data = _a.sent();
                        reroute = data.reroute;
                        _a.label = 5;
                    case 5:
                        routeMatch.data[routeTaskConfig.name] = data;
                        if (reroute) {
                            return [2 /*return*/, { command: task_base_1.TaskResultCommand.REROUTE, routeName: reroute }];
                        }
                        else {
                            return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskElasticsearch.prototype.singleQuery = function (client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var queryTemplate, template, queryJson, query, payload, response, hasResults, noResultsRoute, pagination;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryTemplate = config.queryTemplates;
                        template = routeMatch.getString(queryTemplate.template);
                        routeMatch.templateMetaData = queryTemplate.metaData || {};
                        return [4 /*yield*/, renderer.render(template, routeMatch)];
                    case 1:
                        queryJson = _a.sent();
                        routeMatch.log('Parsing JSON for single query', queryJson);
                        query = JSON.parse(queryJson);
                        delete routeMatch.templateMetaData;
                        payload = {
                            index: queryTemplate.index,
                            type: queryTemplate.type,
                            body: query
                        };
                        return [4 /*yield*/, client.search(payload)];
                    case 2:
                        response = _a.sent();
                        hasResults = response.hits && response.hits.total > 0;
                        noResultsRoute = queryTemplate.noResultsRoute;
                        response.hits = response.hits || { max_score: 0, hits: [], total: 0 };
                        pagination = this.getPagination(query.from || 0, query.size || 10, response.hits.total);
                        response.pagination = pagination;
                        response.request = payload;
                        response.reroute = !hasResults ? noResultsRoute || undefined : undefined;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    TaskElasticsearch.prototype.multiQuery = function (client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryTemplates, bulk, t, queryTemplate, template, queryJson, query, head, paginationDetails, payload, multiResponse, responseMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryTemplates = config.queryTemplates;
                        bulk = [];
                        t = 0;
                        _a.label = 1;
                    case 1:
                        if (!(t < queryTemplates.length)) return [3 /*break*/, 4];
                        queryTemplate = queryTemplates[t];
                        template = routeMatch.getString(queryTemplate.template);
                        routeMatch.templateMetaData = queryTemplate.metaData || {};
                        return [4 /*yield*/, renderer.render(template, routeMatch)];
                    case 2:
                        queryJson = _a.sent();
                        routeMatch.log('Parsing JSON for multi query', queryJson);
                        query = JSON.parse(queryJson);
                        delete routeMatch.templateMetaData;
                        head = { index: queryTemplate.index, type: queryTemplate.type };
                        paginationDetails = { from: query.from || 0, size: query.size || 10 };
                        bulk.push(head);
                        bulk.push(query);
                        queryTemplate.paginationDetails = { from: query.from, size: query.size };
                        _a.label = 3;
                    case 3:
                        ++t;
                        return [3 /*break*/, 1];
                    case 4:
                        payload = { body: bulk };
                        return [4 /*yield*/, client.msearch(payload)];
                    case 5:
                        multiResponse = _a.sent();
                        responseMap = {};
                        if (!multiResponse.responses) {
                            return [2 /*return*/, {}];
                        }
                        multiResponse.responses.forEach(function (response, i) {
                            var name = queryTemplates[i].name;
                            var paginationDetails = queryTemplates[i].paginationDetails || { from: 0, size: 10 };
                            var noResultsRoute = queryTemplates[i].noResultsRoute;
                            var hasResults = response.hits && response.hits.total > 0;
                            response.hits = response.hits || { max_score: 0, hits: [], total: 0 };
                            var pagination = _this.getPagination(paginationDetails.from, paginationDetails.size, response.hits.total);
                            response.pagination = pagination;
                            response.request = bulk[i * 2 + 1];
                            response.reroute =
                                !hasResults ? noResultsRoute || undefined : undefined;
                            responseMap[name] = response;
                        });
                        return [2 /*return*/, responseMap];
                }
            });
        });
    };
    TaskElasticsearch.prototype.getPagination = function (from, size, totalResults) {
        if (from === void 0) { from = 0; }
        if (size === void 0) { size = 10; }
        if (totalResults === void 0) { totalResults = 0; }
        var totalPages = Math.ceil(totalResults / size);
        var currentPage = Math.floor(from / size) + 1;
        var nextPage = currentPage < totalPages ? Math.floor(currentPage + 1) : null;
        var prevPage = currentPage > 1 ? Math.floor(currentPage - 1) : null;
        // Setup an array (range) of 10 numbers surrounding our current page
        var pageRange = Array.from(new Array(9).keys(), function (p, i) { return i + (currentPage - 4); });
        // Move range forward until none of the numbers are less than 1
        var rangeMin = pageRange[0];
        var positiveShift = rangeMin < 1 ? 1 - rangeMin : 0;
        pageRange = pageRange.map(function (p) { return p + positiveShift; });
        // Move range backwards until none of the numbers are greater than
        // totalPages
        var rangeMax = pageRange[pageRange.length - 1];
        var negativeShift = rangeMax > totalPages ? rangeMax - totalPages : 0;
        pageRange = pageRange.map(function (p) { return p - negativeShift; });
        // Prune everything that appears outside of our 1 to totalPages range
        pageRange = pageRange.filter(function (p) { return p >= 1 && p <= totalPages; });
        var pages = [];
        pageRange.forEach(function (page) {
            pages.push({
                pageNumber: Math.floor(page),
                distance: Math.abs(currentPage - page),
            });
        });
        var pagination = {
            from: from,
            size: size,
            totalResults: totalResults,
            totalPages: totalPages,
            currentPage: currentPage,
            nextPage: nextPage,
            prevPage: prevPage,
            pageRange: pages
        };
        return pagination;
    };
    return TaskElasticsearch;
}(task_base_1.TaskBase));
exports.TaskElasticsearch = TaskElasticsearch;
/* tslint:enable:no-any */
//# sourceMappingURL=task-elasticsearch.js.map