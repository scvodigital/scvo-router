import * as es from 'elasticsearch';
import { SearchTemplate } from './search-template';

export class DocumentResultSet implements IDocumentResultSet {
    total: number = 0;
    max_score: number = 0;
    paging: Paging = null;
    documents: IDocumentResult[] = [];

    constructor(resultSet: es.SearchResponse<IDocumentTemplate>, searchTemplate: SearchTemplate, public params: any){
        var query: any = searchTemplate.getBody(this.params);
        var preferredView: string[] = searchTemplate.preferredView;
        var paging: Paging = new Paging({
            from: query.from || null,
            size: query.size || null,
            sort: query.sort || null
        });
        this.total = resultSet.hits.total;
        this.max_score = resultSet.hits.max_score;
        this.paging = paging;
        this.documents = resultSet.hits.hits.map((hit) => {
            var documentResultBase: IDocumentResultBase = {
                _index: hit._index,
                _type: hit._type,
                _id: hit._id,
                _score: hit._score,
                _sort: (<any>hit)._sort || null,
                _view: ''
            };
            var documentResult: DocumentResult = new DocumentResult(documentResultBase, hit._source, preferredView);

            return documentResult;
        }); 
    }
}

export class DocumentResult implements IDocumentResultBase, IDocumentTemplate {
    _index: string = null;
    _type: string = null;
    _id: string = null;
    _score: number = null;
    _sort: any = null;
    _view: string = null;
    Id: string = null;
    author: string = null;
    description: string = null;
    lastUpdated: Date = null;
    tags: string[] = null;
    title: string = null;
    views: {
        name: string;
        html: string;       
    }[] = null;
    publishOn: Date = null;
    dateIndexUpdated: string = null;
    text_bag: string = null;
    og_title: string = null;
    og_description: string = null;
    og_image: string = null;
    json_ld: string = null;
    coords: { 
        lat: number; 
        lon: number 
    } = null;


    constructor(documentResultBase: IDocumentResultBase, hit: IDocumentTemplate, preferredView: string[]) {
        Object.assign(this, documentResultBase);
        Object.assign(this, hit);
       
        if(preferredView.indexOf('details') === -1){
            preferredView.push('details');
        }

        if(this.views.length > 0){
            for(var v = 0; v < preferredView.length; v++){
                var name = preferredView[v];
                var found = this.views.filter((view) => {
                    return view.name === name;
                });
                if(found && found.length > 0){
                    this._view = found[0].html;
                    break;
                }
            }
    
            if(!this._view){
                this._view = this.views[0].html;
            }
        }else{
            this._view = 'No view specified';
        }
    }
}

export class Paging implements IPaging {
    from: number = 0;
    size: number = 10;
    sort?: any = null;

    get nextFrom(): number {
        return this.from + this.size;
    }

    get prevFrom(): number {
        var prev = this.from - this.size;
        return prev >= 0 ? prev : 0;
    }

    constructor(paging: IPaging){
        Object.assign(this, paging);
    }
}

export interface IPaging {
    from?: number;
    size?: number;
    sort?: any;
}

export interface IDocumentTemplate{
    Id: string;
    author: string;
    description: string;
    lastUpdated: Date;
    tags: string[];
    title: string;
    views: {
        name: string;
        html: string;
    }[];
    publishOn: Date;
    dateIndexUpdated: string;
    text_bag: string;
    og_title: string;
    og_description: string;
    og_image: string;
    json_ld: string;
    coords: {
        lat: number;
        lon: number
    };
}

export interface IDocumentResultSet {
    total: number;
    max_score: number;
    paging: Paging;
    documents: IDocumentResult[];
}

export interface IDocumentResultBase {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _sort?: any;
    _view: string;
}

export interface IDocumentResult extends IDocumentResultBase, IDocumentTemplate {

}
