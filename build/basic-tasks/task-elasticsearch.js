"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("elasticsearch");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskElasticsearch extends task_base_1.TaskBase {
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const connectionString = yield renderer.render(config.connectionStringTemplate, routeMatch);
            const configOptions = { host: connectionString, apiVersion: '5.6' };
            Object.assign(configOptions, config.elasticsearchConfig || {});
            const client = new elasticsearch_1.Client(configOptions);
            let data;
            let reroute;
            if (Array.isArray(config.queryTemplates)) {
                data = yield this.multiQuery(client, config, routeMatch, renderer);
                Object.keys(data).forEach((key) => {
                    const routerSearchResponse = data[key];
                    reroute = routerSearchResponse.reroute || reroute;
                });
            }
            else {
                data = yield this.singleQuery(client, config, routeMatch, renderer);
                reroute = data.reroute;
            }
            routeMatch.data[routeTaskConfig.name] = data;
            if (reroute) {
                return { command: task_base_1.TaskResultCommand.REROUTE, routeName: reroute };
            }
            else {
                return { command: task_base_1.TaskResultCommand.CONTINUE };
            }
        });
    }
    singleQuery(client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryTemplate = config.queryTemplates;
            const template = routeMatch.getString(queryTemplate.template);
            const queryJson = yield renderer.render(template, routeMatch);
            const query = JSON.parse(queryJson);
            const payload = {
                index: queryTemplate.index,
                type: queryTemplate.type,
                body: query
            };
            const response = yield client.search(payload);
            const hasResults = response.hits && response.hits.total > 0;
            const noResultsRoute = queryTemplate.noResultsRoute;
            response.hits = response.hits || { max_score: 0, hits: [], total: 0 };
            const pagination = this.getPagination(query.from || 0, query.size || 10, response.hits.total);
            response.pagination = pagination;
            response.request = payload;
            response.reroute = !hasResults ? noResultsRoute || undefined : undefined;
            return response;
        });
    }
    multiQuery(client, config, routeMatch, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryTemplates = config.queryTemplates;
            const bulk = [];
            for (let t = 0; t < queryTemplates.length; ++t) {
                const queryTemplate = queryTemplates[t];
                const template = routeMatch.getString(queryTemplate.template);
                const queryJson = yield renderer.render(template, routeMatch);
                const query = JSON.parse(queryJson);
                const head = { index: queryTemplate.index, type: queryTemplate.type };
                const paginationDetails = { from: query.from || 0, size: query.size || 10 };
                bulk.push(head);
                bulk.push(query);
                queryTemplate.paginationDetails = { from: query.from, size: query.size };
            }
            const payload = { body: bulk };
            const multiResponse = yield client.msearch(payload);
            const responseMap = {};
            if (!multiResponse.responses) {
                return {};
            }
            multiResponse.responses.forEach((response, i) => {
                const name = queryTemplates[i].name;
                const paginationDetails = queryTemplates[i].paginationDetails || { from: 0, size: 10 };
                const noResultsRoute = queryTemplates[i].noResultsRoute;
                const hasResults = response.hits && response.hits.total > 0;
                response.hits = response.hits || { max_score: 0, hits: [], total: 0 };
                const pagination = this.getPagination(paginationDetails.from, paginationDetails.size, response.hits.total);
                response.pagination = pagination;
                response.request = bulk[i * 2 + 1];
                response.reroute =
                    !hasResults ? noResultsRoute || undefined : undefined;
                responseMap[name] = response;
            });
            return responseMap;
        });
    }
    getPagination(from = 0, size = 10, totalResults = 0) {
        const totalPages = Math.ceil(totalResults / size);
        const currentPage = Math.floor(from / size) + 1;
        const nextPage = currentPage < totalPages ? Math.floor(currentPage + 1) : null;
        const prevPage = currentPage > 1 ? Math.floor(currentPage - 1) : null;
        // Setup an array (range) of 10 numbers surrounding our current page
        let pageRange = Array.from(new Array(9).keys(), (p, i) => i + (currentPage - 4));
        // Move range forward until none of the numbers are less than 1
        const rangeMin = pageRange[0];
        const positiveShift = rangeMin < 1 ? 1 - rangeMin : 0;
        pageRange = pageRange.map(p => p + positiveShift);
        // Move range backwards until none of the numbers are greater than
        // totalPages
        const rangeMax = pageRange[pageRange.length - 1];
        const negativeShift = rangeMax > totalPages ? rangeMax - totalPages : 0;
        pageRange = pageRange.map(p => p - negativeShift);
        // Prune everything that appears outside of our 1 to totalPages range
        pageRange = pageRange.filter(p => p >= 1 && p <= totalPages);
        const pages = [];
        pageRange.forEach((page) => {
            pages.push({
                pageNumber: Math.floor(page),
                distance: Math.abs(currentPage - page),
            });
        });
        const pagination = {
            from,
            size,
            totalResults,
            totalPages,
            currentPage,
            nextPage,
            prevPage,
            pageRange: pages
        };
        return pagination;
    }
}
exports.TaskElasticsearch = TaskElasticsearch;
/* tslint:enable:no-any */
//# sourceMappingURL=task-elasticsearch.js.map