export declare class Helpers {
    static register(hbs: any): void;
    static helper_split(str: string, delimiter: string): string[];
    static helper_firstItem(arr: any[]): any;
    static helper_lastItem(arr: any[]): any;
    static helper_slugify(str: string): any;
    static helper_querystringify(obj?: any): string;
    static helper_ngStringify(obj: any): string;
    static helper_contains(arr: any[], val: any): boolean;
    static helper_parse(str: string): any;
    static helper_keyValue(obj: any): any[];
}
export interface IHelperArgs {
    name: string;
    hash: any;
    data: any;
}
