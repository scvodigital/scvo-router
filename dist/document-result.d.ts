import * as es from 'elasticsearch';
import { SearchTemplate } from './search-template';
export declare class DocumentResultSet implements IDocumentResultSet {
    params: any;
    total: number;
    max_score: number;
    paging: Paging;
    documents: IDocumentResult[];
    constructor(resultSet: es.SearchResponse<IDocumentTemplate>, searchTemplate: SearchTemplate, params: any);
}
export declare class DocumentResult implements IDocumentResultBase, IDocumentTemplate {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _sort: any;
    _view: string;
    Id: string;
    author: string;
    description: string;
    lastUpdated: Date;
    tags: string[];
    title: string;
    views: {
        name: string;
        html: string;
    }[];
    publishOn: Date;
    dateIndexUpdated: string;
    text_bag: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    coords: {
        lat: number;
        lon: number;
    };
    constructor(documentResultBase: IDocumentResultBase, hit: IDocumentTemplate, preferredView: string[]);
}
export declare class Paging implements IPaging {
    from: number;
    size: number;
    sort?: any;
    readonly nextFrom: number;
    readonly prevFrom: number;
    constructor(paging: IPaging);
}
export interface IPaging {
    from?: number;
    size?: number;
    sort?: any;
}
export interface IDocumentTemplate {
    Id: string;
    author: string;
    description: string;
    lastUpdated: Date;
    tags: string[];
    title: string;
    views: {
        name: string;
        html: string;
    }[];
    publishOn: Date;
    dateIndexUpdated: string;
    text_bag: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    coords: {
        lat: number;
        lon: number;
    };
}
export interface IDocumentResultSet {
    total: number;
    max_score: number;
    paging: Paging;
    documents: IDocumentResult[];
}
export interface IDocumentResultBase {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _sort?: any;
    _view: string;
}
export interface IDocumentResult extends IDocumentResultBase, IDocumentTemplate {
}
