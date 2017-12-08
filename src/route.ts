// Module imports
import { ConfigOptions } from 'elasticsearch';

// Internal imports
import { IRoute, ILinkTag, IMetaTag, ISearchTemplate, ISearchTemplateSet, IJsonable, INamedPattern, INamedTemplate, IContext } from './interfaces';
import { SearchTemplate } from './search-template';
import { MapJsonify } from './map-jsonify';

/** Class that handles a route match, implements search templates and gets results */
export class Route implements IRoute, IJsonable {
    name: string = '_default';
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    metaData: any = {};
    pattern: string|INamedPattern = '';
    queryDelimiter: string = '&';
    queryEquals: string = '=';
    templates: INamedTemplate = { default: `
        {{#and primaryResultSet primaryResultSet.documents}}
            {{#forEach primaryResultSet.documents}}
                {{{_view}}}
            {{/forEach}}
        {{/and}}` };
    titleTemplate: string = '';
    jsonLdTemplate: string = '';
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: ISearchTemplateSet = {};
    elasticsearchConfig: ConfigOptions = null;
    multipleResults: boolean = false;
    defaultParams: any = {};
    javascript: string = '';

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
            templates: this.templates,
            titleTemplate: this.titleTemplate,
            jsonLdTemplate: this.jsonLdTemplate,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            supplimentarySearchTemplates: templates,
            elasticsearchConfig: this.elasticsearchConfig,
            multipleResults: this.multipleResults,
            defaultParams: this.defaultParams,
            javascript: this.javascript,
            context: this.context
        };
    }

    get defaultParamsCopy(): any {
        var copy = {};
        Object.assign(copy, this.defaultParams);
        return copy;
    }

    /**
     * Create a Route 
     * @param {IRoute} [route] - Optional JSON that contains information about the route
     */
    constructor(route: IRoute = null, public context: IContext){
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
