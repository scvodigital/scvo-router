import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';

helpers({ handlebars: handlebars });

export class SearchTemplate implements ISearchTemplate {
    template: string = '';
    type: string = '';
    preferredView: string[] = ['details'];
    compiled: (obj: any, hbs?: any) => string = null;

    constructor(searchTemplate: ISearchTemplate){
        Object.assign(this, searchTemplate);
        this.compiled = handlebars.compile(this.template);
    }

    getHead(): any {
        return { index: 'web-content-production', type: this.type };
    }

    getBody(params: any): any {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        return parsed;
    }

    getPrimary(params: any): any {
        var query = this.compiled(params);
        var parsed = JSON.parse(query);
        var payload = {
            index: 'web-content-production',
            type: this.type,
            body: parsed
        };
        return payload;
    }
}

export interface ISearchTemplate {
    type: string;
    template: string;
    preferredView: string[];
}
