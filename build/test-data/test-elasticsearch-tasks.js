"use strict";
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
var TaskElasticsearch = /** @class */ (function () {
    function TaskElasticsearch() {
    }
    TaskElasticsearch.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, connectionString, configOptions, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = routeTaskConfig.config;
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        data = {};
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
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.singleQuery(client, config, routeMatch, renderer)];
                    case 4:
                        data = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskElasticsearch.prototype.singleQuery = function (client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var queryTemplate, queryJson, query, payload, response, reroute, pagination, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryTemplate = config.queryTemplates;
                        return [4 /*yield*/, renderer.render(queryTemplate.template, routeMatch)];
                    case 1:
                        queryJson = _a.sent();
                        query = JSON.parse(queryJson);
                        payload = {
                            index: queryTemplate.index,
                            type: queryTemplate.type,
                            body: query
                        };
                        return [4 /*yield*/, client.search(payload)];
                    case 2:
                        response = _a.sent();
                        reroute = '';
                        if (queryTemplate.noResultsRoute &&
                            (!response.hits || !response.hits.total)) {
                            console.log('No results route for response:', response);
                            throw new Error('No results');
                        }
                        else if (!response.hits || !response.hits.total) {
                            console.log('No no results route for response', JSON.stringify(response, null, 4));
                            response.hits = { max_score: 0, hits: [], total: 0 };
                            reroute = queryTemplate.noResultsRoute || undefined;
                        }
                        pagination = this.getPagination(query.from || 0, query.size || 10, response.hits.total);
                        response.pagination = pagination;
                        response.request = payload;
                        result = { response: response, reroute: reroute || undefined };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    TaskElasticsearch.prototype.multiQuery = function (client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryTemplates, bulk, t, queryTemplate, queryJson, body, head, paginationDetails, payload, multiResponse, responseMap, reroute, result;
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
                        return [4 /*yield*/, renderer.render(queryTemplate.template, routeMatch)];
                    case 2:
                        queryJson = _a.sent();
                        body = JSON.parse(queryJson);
                        head = { index: queryTemplate.index, type: queryTemplate.type };
                        paginationDetails = { from: body.from || 0, size: body.size || 10 };
                        bulk.push(head);
                        bulk.push(body);
                        queryTemplate.paginationDetails = { from: body.from, size: body.size };
                        _a.label = 3;
                    case 3:
                        t++;
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
                        reroute = '';
                        multiResponse.responses.forEach(function (response, i) {
                            var name = queryTemplates[i].name;
                            var paginationDetails = queryTemplates[i].paginationDetails || { from: 0, size: 10 };
                            var noResultsRoute = queryTemplates[i].noResultsRoute;
                            responseMap[name] = response;
                            if (!response.hits || !response.hits.total) {
                                console.log('No no results route for response', JSON.stringify(response, null, 4));
                                response.hits = { max_score: 0, hits: [], total: 0 };
                                if (noResultsRoute && !reroute) {
                                    reroute = noResultsRoute;
                                }
                            }
                            var pagination = _this.getPagination(paginationDetails.from, paginationDetails.size, response.hits.total);
                            response.pagination = pagination;
                            response.request = bulk[i * 2 + 1];
                        });
                        result = {
                            response: responseMap,
                            reroute: reroute || undefined
                        };
                        return [2 /*return*/, result];
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
}());
exports.TaskElasticsearch = TaskElasticsearch;
/* tslint:enable:no-any */
//# sourceMappingURL=test-elasticsearch-tasks.js.map