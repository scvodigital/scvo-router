import * as Url from 'url';

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
}
