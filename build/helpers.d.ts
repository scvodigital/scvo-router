import * as moment from 'moment';
export interface Handlebars {
    registerHelper: (...args: any[]) => void;
}
export declare class Helpers {
    static handlebars: any;
    static register(hbs: Handlebars): void;
    static helper_split(str: string, delimiter: string): string[];
    static helper_arrayify(input: any): any[];
    static helper_firstItem(arr: any[]): any;
    static helper_lastItem(arr: any[]): any;
    static helper_slugify(str: string): string;
    static helper_querystringify(obj?: any): string;
    static helper_ngStringify(obj: any): string;
    static helper_jsStringify(obj: any): string;
    static helper_indexOf(haystack: any[], needle: any): number | null;
    static helper_itemAt(haystack: any[], index: number): any;
    static helper_corresponding(source: any[], target: any[], item: any): any;
    static helper_contains(input: any[] | string, val: any): boolean;
    static helper_parse(str: string): any;
    static helper_keyValue(obj: any): {
        key: string;
        value: any;
    }[];
    static helper_moment(date?: any, format?: string): moment.Moment;
    static helper_momentFormat(date: moment.Moment, format?: string): string;
    static helper_atob(b64: string): string;
    static helper_btoa(str: string): string;
    static helper_removeEntities(str: string): string;
    static helper_getProperty(obj: any, path: string): any;
    static helper_dot(path: string, options: any): "" | null;
    static helper_getType(obj: any): "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";
    static helper_regexReplace(input: string, expression: string, options: string, replace: string): string;
    static helper_regexMatch(input: string, expression: string, options: string): boolean;
    static helper_reverse(input: any[]): any[];
    static helper_stripTrailingSlash(input: string): string;
    static helper_stripDomains(input: string, domains: string[]): string;
    static helper_length(input: any[] | string): number;
    static helper_pluck(items: any[], path: string): any[] | null;
    static helper_component(partialName: string, options: any): any;
    static helper_log(message: string, obj: any): void;
}
export interface IHelperArgs {
    name: string;
    hash: any;
    data: any;
}
