import { Client, ConfigOptions, SearchResponse } from 'elasticsearch';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskResult } from '../task-base';
export declare class TaskElasticsearch {
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskElasticsearchConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    singleQuery(client: Client, config: TaskElasticsearchConfiguration, routeMatch: RouteMatch, renderer: RendererBase): Promise<RouterSearchResult<any>>;
    multiQuery(client: Client, config: TaskElasticsearchConfiguration, routeMatch: RouteMatch, renderer: RendererBase): Promise<RouterSearchResult<any>>;
    getPagination(from?: number, size?: number, totalResults?: number): Pagination;
}
export interface TaskElasticsearchConfiguration {
    connectionStringTemplate: string;
    elasticsearchConfig: ConfigOptions;
    queryTemplates: ElasticsearchQueryTemplate[] | ElasticsearchQueryTemplate;
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
    response?: RouterSearchResponse<T> | RouterSearchResponseMap<T>;
    reroute?: string;
}
export interface RouterSearchResponse<T> extends SearchResponse<T> {
    pagination?: Pagination;
    request?: any;
    took: number;
    timed_out: boolean;
    hits: {
        total: number;
        max_score: number;
        hits: Array<{
            _index: string;
            _type: string;
            _id: string;
            _score: number;
            _source: T;
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
    nextPage?: number | null;
    prevPage?: number | null;
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
