// Module imports
import { ConfigOptions } from 'elasticsearch';

// Internal imports
import { IRoute, ILinkTag, IMetaTag, ISearchTemplate, ISearchTemplateSet, IJsonable } from './interfaces';
import { SearchTemplate } from './search-template';
import { MapJsonify } from './map-jsonify';

/** Class that handles a route match, implements search templates and gets results */
export class Route implements IRoute, IJsonable {
    name: string = '_default';
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    metaData: any = {};
    pattern: string = '';
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    template: string = `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}`;
    jsonLdTemplate: string = '';
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: ISearchTemplateSet = {};
    elasticsearchConfig: ConfigOptions = null;
    multipleResults: boolean = false;
    defaultParams: any = {};

    public toJSON(): IRoute{
        var templates = MapJsonify<ISearchTemplate>(this.supplimentarySearchTemplates);
        return {
            name: this.name,
            linkTags: this.linkTags,
            metaTags: this.metaTags,
            metaData: this.metaData,
            pattern: this.pattern,
            queryDelimiter: this.queryDelimiter,
            queryEquals: this.queryEquals,
            template: this.template,
            jsonLdTemplate: this.jsonLdTemplate,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            supplimentarySearchTemplates: templates,
            elasticsearchConfig: this.elasticsearchConfig,
            multipleResults: this.multipleResults,
            defaultParams: this.defaultParams,
        };
    }

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
