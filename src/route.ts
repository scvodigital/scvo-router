// Module imports
import { ConfigOptions } from 'elasticsearch';

// Internal imports
import { IRoute, ILinkTag, IMetaTag, ISearchTemplate, ISearchTemplateSet } from './interfaces';
import { SearchTemplate } from './search-template';

/** Class that handles a route match, implements search templates and gets results */
export class Route implements IRoute {
    name: string = '_default';
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = '';
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    template: string = `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}`;
    primarySearchTemplate: ISearchTemplate = null;
    supplimentarySearchTemplates: ISearchTemplateSet = {};
    elasticsearchConfig: ConfigOptions = null;
    
    /**
     * Create a Route 
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route: IRoute = null){
        if(route){
            // If given an IRoute, implement it
            Object.assign(this, route);
        }

        // Upgrade our JSON to real classes
        this.primarySearchTemplate = new SearchTemplate(this.primarySearchTemplate);
        Object.keys(this.supplimentarySearchTemplates).forEach((key: string) => {
            this.supplimentarySearchTemplates[key] = new SearchTemplate(this.supplimentarySearchTemplates[key]);
        });
    }
}
