import { Client, ConfigOptions, SearchResponse } from 'elasticsearch';
import { RouteTaskConfiguration } from '../configuration-interfaces';
import { RendererBase } from '../renderer-base';
import { RouteMatch } from '../route-match';
import { TaskBase, TaskResult } from '../task-base';
export declare class TaskElasticsearch extends TaskBase {
    execute(routeMatch: RouteMatch, routeTaskConfig: RouteTaskConfiguration<TaskElasticsearchConfiguration>, renderer?: RendererBase): Promise<TaskResult>;
    singleQuery(client: Client, config: TaskElasticsearchConfiguration, routeMatch: RouteMatch, renderer: RendererBase): Promise<RouterSearchResponse<any>>;
    multiQuery(client: Client, config: TaskElasticsearchConfiguration, routeMatch: RouteMatch, renderer: RendererBase): Promise<RouterSearchResponseMap<any>>;
    getPagination(from?: number, size?: number, totalResults?: number): Pagination;
    private getTemplate(pathOrTemplate, routeMatch);
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
