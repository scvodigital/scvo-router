import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as es from 'elasticsearch';

import { SearchTemplate } from './search-template';
import { DocumentResultSet, IDocumentTemplate } from './document-result';
import { IRoute } from './route';
import { ILinkTag, IMetaTag } from './interfaces';

helpers({handlebars: handlebars});

export class RouteMatch implements IRouteMatch {
    linkTags: ILinkTag[] = null;
    metaTags: IMetaTag[] = null;
    pattern: string = null;
    primarySearchTemplate: SearchTemplate = null;
    supplimentarySearchTemplates: SearchTemplate[] = null;
    title: string = '';   
    template: string = '';
    primaryResultSet: DocumentResultSet = null;
    supplimentaryResultSets: DocumentResultSet[] = [];
    html: string = '';

    constructor(routeMatch: IRoute, public params: any, primaryResultSet: es.SearchResponse<IDocumentTemplate>, supplimentaryResultsSets?: es.MSearchResponse<IDocumentTemplate>){
        Object.assign(this, routeMatch);

        this.primaryResultSet = new DocumentResultSet(primaryResultSet, this.primarySearchTemplate, this.params);

        if(supplimentaryResultsSets && supplimentaryResultsSets.responses){
            this.supplimentaryResultSets = supplimentaryResultsSets.responses.map((resultSet: es.SearchResponse<IDocumentTemplate>, i: number) => {
                var searchTemplate = this.supplimentarySearchTemplates[i];
                var documentResultSet: DocumentResultSet = new DocumentResultSet(resultSet, searchTemplate, this.params);
                return documentResultSet;
            });
        }

        var hbs = handlebars.compile(this.template);
        this.html = hbs(this);
    }
}

export interface IRouteMatch extends IRoute {
    params: any;
    primaryResultSet: DocumentResultSet;
    supplimentaryResultSets?: DocumentResultSet[];
    html: string;
}
