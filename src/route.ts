import { SearchTemplate } from './search-template';
import { ILinkTag, IMetaTag } from './interfaces';

export class Route implements IRoute {
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = '';
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: SearchTemplate[] = null;
    title: string;
    template: string = `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}
    `;

    constructor(public siteKey: string, route?: IRoute){
        if(route){
            Object.assign(this, route);
        }

        if(this.primarySearchTemplate){
            this.primarySearchTemplate = new SearchTemplate(this.primarySearchTemplate);
        }else{
            this.primarySearchTemplate = new SearchTemplate({
                type: this.siteKey + '_static-content',
                template: '{ "query": { "term": { "_id": "{{path}}" } } }',
                preferredView: ['details']
            });
        }

        if(this.supplimentarySearchTemplates && this.supplimentarySearchTemplates.length > 0){
            this.supplimentarySearchTemplates = this.supplimentarySearchTemplates.map((searchTemplate) => {
                return new SearchTemplate(searchTemplate);
            });
        }
    }

    getPrimaryQuery(params: any){
        var query = this.primarySearchTemplate.getPrimary(params);
        return query;
    }

    getSupplimentaryQueries(params: any){
        if(this.supplimentarySearchTemplates){
            var queries = [];
            this.supplimentarySearchTemplates.forEach((searchTemplate: SearchTemplate) => {
                var head = searchTemplate.getHead();
                var body = searchTemplate.getBody(params);
                queries.push(head);
                queries.push(body);
            });
            return queries;
        }else{
            return null;
        }
    }

    get route(): IRoute{
        var route: IRoute = {
            linkTags: this.linkTags,
            metaTags: this.metaTags,
            pattern: this.pattern,
            primarySearchTemplate: this.primarySearchTemplate,
            supplimentarySearchTemplates: this.supplimentarySearchTemplates,
            title: this.title,
            template: this.template
        };
        return route;
    }
}

export interface IRoutes { 
    [routeKey: string]: IRoute;
}

export interface IRoute {
    linkTags: ILinkTag[];
    metaTags: IMetaTag[];
    pattern: string;
    primarySearchTemplate?: SearchTemplate;
    supplimentarySearchTemplates?: SearchTemplate[];
    title: string;   
    template: string;
}
