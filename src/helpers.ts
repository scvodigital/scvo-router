import * as Url from 'url';
import * as querystring from 'querystring';
import * as s from 'string';

export class Helpers {
    static register(hbs: any) {
        Object.getOwnPropertyNames(this).forEach((prop) => {
            if(prop.indexOf('helper_') === 0 && typeof this[prop] === 'function'){
                var name = prop.replace(/helper_/, '');
                hbs.registerHelper(name, this[prop]);
            }
        });
    }

    static helper_split(str: string, delimiter: string) {
        var parts = !str ? [] : str.split(delimiter);
        return parts;
    }

    static helper_firstItem(arr: any[]) {
        if(!arr) return null;
        if(!Array.isArray(arr)) return null;
        if(arr.length === 0) return null;
        return arr[0];
    }
    
    static helper_lastItem(arr: any[]) {
        if(!arr) return null;
        if(!Array.isArray(arr)) return null;
        if(arr.length === 0) return null;
        return arr[arr.length - 1];
    }

    static helper_slugify(str: string) {
        var slug = s(str).slugify().s;
        return slug;
    }

    static helper_querystringify(obj: any = {}) {
        var args: IHelperArgs = arguments[1];
        if(args && args.hash){
            Object.assign(obj, args.hash);
        }
        var qs = querystring.stringify(obj);
        return qs;
    }

    static helper_ngStringify(obj: any) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/\{/g, "{{ '{' }}");
        return json;
    }

    static helper_contains(arr: any[], val: any) {
        var contains = arr.indexOf(val) > -1;
        return contains;
    }

    static helper_parse(str: string) {
        var obj = JSON.parse(str);
        return obj;
    }
}

export interface IHelperArgs {
    name: string;
    hash: any;
    data: any;
}
