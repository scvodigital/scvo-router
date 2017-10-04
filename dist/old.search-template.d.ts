export declare class SearchTemplate implements ISearchTemplate {
    template: string;
    type: string;
    preferredView: string[];
    compiled: (obj: any, hbs?: any) => string;
    constructor(searchTemplate: ISearchTemplate);
    getHead(): any;
    getBody(params: any): any;
    getPrimary(params: any): any;
}
export interface ISearchTemplate {
    type: string;
    template: string;
    preferredView: string[];
}
