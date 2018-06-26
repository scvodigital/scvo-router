import {Client, ConfigOptions, MSearchParams, MSearchResponse, SearchResponse} from 'elasticsearch';

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskElasticsearch {
  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskElasticsearchConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    const config = routeTaskConfig.config;

    if (!renderer) {
      throw new Error('No renderer specified');
    }

    let data = {};

    const connectionString =
        await renderer.render(config.connectionStringTemplate, routeMatch);
    const configOptions:
        ConfigOptions = {host: connectionString, apiVersion: '5.6'};
    (Object as any).assign(configOptions, config.elasticsearchConfig || {});

    const client = new Client(configOptions);

    if (Array.isArray(config.queryTemplates)) {
      data = await this.multiQuery(client, config, routeMatch, renderer);
    } else {
      data = await this.singleQuery(client, config, routeMatch, renderer);
    }

    return {command: TaskResultCommand.CONTINUE};
  }

  async singleQuery(
      client: Client, config: TaskElasticsearchConfiguration,
      routeMatch: RouteMatch,
      renderer: RendererBase): Promise<RouterSearchResult<any>> {
    const queryTemplate = (config.queryTemplates as ElasticsearchQueryTemplate);
    const queryJson = await renderer.render(queryTemplate.template, routeMatch);
    const query = JSON.parse(queryJson);

    const payload = {
      index: queryTemplate.index,
      type: queryTemplate.type,
      body: query
    };

    const response: RouterSearchResponse<any> =
        await client.search<any>(payload);
    let reroute: string|undefined = '';

    if (queryTemplate.noResultsRoute &&
        (!response.hits || !response.hits.total)) {
      console.log('No results route for response:', response);
      throw new Error('No results');
    } else if (!response.hits || !response.hits.total) {
      console.log(
          'No no results route for response',
          JSON.stringify(response, null, 4));
      response.hits = {max_score: 0, hits: [], total: 0};
      reroute = queryTemplate.noResultsRoute || undefined;
    }

    const pagination = this.getPagination(
        query.from || 0, query.size || 10, response.hits.total);
    response.pagination = pagination;
    response.request = payload;

    const result:
        RouterSearchResult<any> = {response, reroute: reroute || undefined};

    return result;
  }

  async multiQuery(
      client: Client, config: TaskElasticsearchConfiguration,
      routeMatch: RouteMatch,
      renderer: RendererBase): Promise<RouterSearchResult<any>> {
    const queryTemplates =
        config.queryTemplates as ElasticsearchQueryTemplate[];
    const bulk: any[] = [];

    for (let t = 0; t < queryTemplates.length; t++) {
      const queryTemplate = queryTemplates[t];
      const queryJson =
          await renderer.render(queryTemplate.template, routeMatch);
      const body = JSON.parse(queryJson);
      const head = {index: queryTemplate.index, type: queryTemplate.type};
      const paginationDetails:
          PaginationDetails = {from: body.from || 0, size: body.size || 10};
      bulk.push(head);
      bulk.push(body);
      queryTemplate.paginationDetails = {from: body.from, size: body.size};
    }

    const payload: MSearchParams = {body: bulk};

    const multiResponse: MSearchResponse<any> = await client.msearch(payload);
    const responseMap: RouterSearchResponseMap<any> = {};

    if (!multiResponse.responses) {
      return {};
    }

    let reroute = '';

    multiResponse.responses.forEach(
        (response: RouterSearchResponse<any>, i: number) => {
          const name = queryTemplates[i].name;
          const paginationDetails =
              queryTemplates[i].paginationDetails || {from: 0, size: 10};
          const noResultsRoute = queryTemplates[i].noResultsRoute;

          responseMap[name] = response;

          if (!response.hits || !response.hits.total) {
            console.log(
                'No no results route for response',
                JSON.stringify(response, null, 4));
            response.hits = {max_score: 0, hits: [], total: 0};
            if (noResultsRoute && !reroute) {
              reroute = noResultsRoute;
            }
          }

          const pagination = this.getPagination(
              paginationDetails.from, paginationDetails.size,
              response.hits.total);
          response.pagination = pagination;
          response.request = bulk[i * 2 + 1];
        });

    const result: RouterSearchResult<any> = {
      response: responseMap,
      reroute: reroute || undefined
    };
    return result;
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

export interface RouterSearchResult<T> {
  response?: RouterSearchResponse<T>|RouterSearchResponseMap<T>;
  reroute?: string;
}

export interface RouterSearchResponse<T> extends SearchResponse<T> {
  pagination?: Pagination;
  request?: any;
  took: number;
  timed_out: boolean;
  hits: {
    total: number; max_score: number;
    hits: Array<{
      _index: string; _type: string; _id: string; _score: number; _source: T;
      _version?: number;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      sort?: string[];
    }>;
  };
  aggregations?: any;
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
