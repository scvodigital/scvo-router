import dot = require('dot-object');
import {Client, ConfigOptions, MSearchParams, MSearchResponse, SearchResponse} from 'elasticsearch';

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskElasticsearch extends TaskBase {
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskElasticsearchConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw Error('No renderer specified');
    }

    const config = routeTaskConfig.config;

    const connectionString =
        await renderer.render(config.connectionStringTemplate, routeMatch);
    const configOptions:
        ConfigOptions = {host: connectionString, apiVersion: '5.6'};
    Object.assign(configOptions, config.elasticsearchConfig || {});

    const client = new Client(configOptions);

    let data: any;
    let reroute: string|undefined;

    if (Array.isArray(config.queryTemplates)) {
      data = await this.multiQuery(client, config, routeMatch, renderer);
      Object.keys(data as RouterSearchResponseMap<any>).forEach((key) => {
        const routerSearchResponse = data[key] as RouterSearchResponse<any>;
        reroute = routerSearchResponse.reroute || reroute;
      });
    } else {
      data = await this.singleQuery(client, config, routeMatch, renderer);
      reroute = (data as RouterSearchResponse<any>).reroute;
    }

    routeMatch.data[routeTaskConfig.name] = data;

    if (reroute) {
      return {command: TaskResultCommand.REROUTE, routeName: reroute};
    } else {
      return {command: TaskResultCommand.CONTINUE};
    }
  }

  async singleQuery(
      client: Client, config: TaskElasticsearchConfiguration,
      routeMatch: RouteMatch,
      renderer: RendererBase): Promise<RouterSearchResponse<any>> {
    const queryTemplate = (config.queryTemplates as ElasticsearchQueryTemplate);
    const template = routeMatch.getString(queryTemplate.template);
    const queryJson = await renderer.render(template, routeMatch);
    const query = JSON.parse(queryJson);

    const payload = {
      index: queryTemplate.index,
      type: queryTemplate.type,
      body: query
    };

    const response =
        (await client.search<any>(payload) as RouterSearchResponse<any>);
    const hasResults = response.hits && response.hits.total > 0;
    const noResultsRoute = queryTemplate.noResultsRoute;

    response.hits = response.hits || {max_score: 0, hits: [], total: 0};

    const pagination = this.getPagination(
        query.from || 0, query.size || 10, response.hits.total);
    response.pagination = pagination;
    response.request = payload;
    response.reroute = !hasResults ? noResultsRoute || undefined : undefined;

    return response;
  }

  async multiQuery(
      client: Client, config: TaskElasticsearchConfiguration,
      routeMatch: RouteMatch,
      renderer: RendererBase): Promise<RouterSearchResponseMap<any>> {
    const queryTemplates =
        config.queryTemplates as ElasticsearchQueryTemplate[];
    const bulk: any[] = [];

    for (let t = 0; t < queryTemplates.length; ++t) {
      const queryTemplate = queryTemplates[t];
      const template = routeMatch.getString(queryTemplate.template);
      const queryJson = await renderer.render(template, routeMatch);
      const query = JSON.parse(queryJson);

      const head = {index: queryTemplate.index, type: queryTemplate.type};
      const paginationDetails:
          PaginationDetails = {from: query.from || 0, size: query.size || 10};
      bulk.push(head);
      bulk.push(query);
      queryTemplate.paginationDetails = {from: query.from, size: query.size};
    }

    const payload: MSearchParams = {body: bulk};

    const multiResponse = await client.msearch(payload);
    const responseMap: RouterSearchResponseMap<any> = {};

    if (!multiResponse.responses) {
      return {};
    }

    multiResponse.responses.forEach(
        (response: RouterSearchResponse<any>, i: number) => {
          const name = queryTemplates[i].name;
          const paginationDetails =
              queryTemplates[i].paginationDetails || {from: 0, size: 10};
          const noResultsRoute = queryTemplates[i].noResultsRoute;
          const hasResults = response.hits && response.hits.total > 0;

          response.hits = response.hits || {max_score: 0, hits: [], total: 0};

          const pagination = this.getPagination(
              paginationDetails.from, paginationDetails.size,
              response.hits.total);

          response.pagination = pagination;
          response.request = bulk[i * 2 + 1];
          response.reroute =
              !hasResults ? noResultsRoute || undefined : undefined;
          responseMap[name] = response;
        });
    return responseMap;
  }

  getPagination(from = 0, size = 10, totalResults = 0): Pagination {
    const totalPages = Math.ceil(totalResults / size);
    const currentPage = Math.floor(from / size) + 1;

    const nextPage =
        currentPage < totalPages ? Math.floor(currentPage + 1) : null;
    const prevPage = currentPage > 1 ? Math.floor(currentPage - 1) : null;

    // Setup an array (range) of 10 numbers surrounding our current page
    let pageRange =
        Array.from(new Array(9).keys(), (p, i) => i + (currentPage - 4));

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

    const pages: PaginationPage[] = [];

    pageRange.forEach((page: number) => {
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

export interface TaskElasticsearchConfiguration {
  connectionStringTemplate: string;
  elasticsearchConfig: ConfigOptions;
  queryTemplates: ElasticsearchQueryTemplate[]|ElasticsearchQueryTemplate;
}

export interface ElasticsearchQueryTemplate {
  name: string;
  index: string;
  type: string;
  template: string;
  paginationDetails?: PaginationDetails;
  noResultsRoute?: string;
}

export interface HandlebarsHelpers {
  [name: string]: (...args: any[]) => any;
}

export interface RouterSearchResponse<T> extends SearchResponse<T> {
  pagination?: Pagination;
  request?: any;
  reroute?: string;
}

export interface RouterSearchResponseMap<T> {
  [name: string]: RouterSearchResponse<T>;
}

export interface Pagination {
  from?: number;
  size?: number;
  totalResults?: number;
  totalPages?: number;
  currentPage?: number;
  nextPage?: number|null;
  prevPage?: number|null;
  pageRange?: PaginationPage[];
}

export interface PaginationPage {
  pageNumber: number;
  distance: number;
}

export interface PaginationDetails {
  from: number;
  size: number;
}
/* tslint:enable:no-any */
