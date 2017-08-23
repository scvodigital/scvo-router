/*import {
    ISiteConfig,
    IMetaTag,
    ILinkTag,
    IMenus
} from './site';*/
import {
    IRoutes,
    IRouteMatch,
    IDocumentTemplate,
    IDocumentResultSet
} from './route';

declare var window, document: any;

export class ScvoLoader {
    constructor(public site: IScvoSite) {
        this.setup();
        document.head.querySelector('base').setAttribute('href', '/app/assets/empty/');
        document.addEventListener('DOMContentLoaded', function(){
            document.head.querySelector('base').setAttribute('href', '/');
        });
        document.querySelector('#loader').style.display = 'none';
    }

    renderPage() {
        var route: IRouteMatch = this.site.routeMatch;
        document.querySelector('#page-content').innerHTML = route.html;

        this.renderRouteHeadTags(route);            

        if (route.primaryResultSet.total === 1) {
            this.renderSinglePrimaryHeadTags(route.primaryResultSet.documents[0]);
        } else if (route.primaryResultSet.total > 1) {
            // TODO: Make multi JSON LD for results using a template in Route
        } else {
            // TODO: Use Site JSON LD
        }
    }

    renderRouteHeadTags(route: IRouteMatch){
        if (route.linkTags) {
            route.linkTags.forEach((linkTag) => {
                var replaceQuery = linkTag.name ? '[name="' + linkTag.name + '"]' : null;
                new NewTag({
                    tagName: 'link',
                    parent: document.head,
                    attributes: linkTag,
                    replaceQuery: replaceQuery
                }).tag;
            });
        }

        if (route.metaTags) {
            route.metaTags.forEach((metaTag) => {
                var replaceQuery = metaTag.name ? '[name="' + metaTag.name + '"]' : null;
                new NewTag({
                    tagName: 'meta',
                    parent: document.head,
                    attributes: metaTag,
                    replaceQuery: replaceQuery
                }).tag;
            });
        }
    }

    renderSinglePrimaryHeadTags(doc: IDocumentTemplate){
        console.log(doc);
    
        if(doc.description){
            new NewTag({
                tagName: 'meta',
                parent: document.head,
                attributes: { name: 'description', content: doc.description },
                replaceQuery: '[name="description"]'
            }).tag;
        }

        if(doc.title){
            new NewTag({
                tagName: 'title',
                parent: document.head,
                attributes: {},
                inner: { text: this.site.siteConfig.title + ' &#187 ' + doc.title },
                replaceQuery: 'title'
            }).tag;
        }

        if(doc.json_ld){
            new NewTag({
                tagName: 'script',
                parent: document.head,
                attributes: {
                    type: 'application/ld+json'
                },
                replaceQuery: '[type="application/ld+json"]'
            }).tag;
        }
    }

    redernMultiplePrimaryHeadTags(resultSet: IDocumentResultSet){
        var url = window.location.href;
        url = url.replace(/(\?|\&)(page\=\d*)/gi, '');
        if(resultSet.paging.nextFrom){
            var nextString = 'page=' + resultSet.paging.nextFrom;
            if(url.indexOf('?') === -1){
                nextString = url + '?' + nextString;
            }else{
                nextString = url + '&' +  nextString;
            }
            new NewTag({
                tagName: 'rel',
                parent: document.head,
                attributes: { href: nextString, name: 'next' },
                replaceQuery: '[name="next"]'
            }).tag;
        } 
        if(resultSet.paging.prevFrom){
            var prevString = 'page=' + resultSet.paging.prevFrom;
            if(url.indexOf('?') === -1){
                prevString = url + '?' + prevString;
            }else{
                prevString = url + '&' + prevString;
            }
            new NewTag({
                tagName: 'rel',
                parent: document.head,
                attributes: { href: prevString, name: 'prev' },
                replaceQuery: '[name="prev"]'
            }).tag;
        } 
    }

    setup() {
        this.site.siteConfig.scripts.forEach((script: string) => {
            document.write('<scr' + 'ipt src="' + script + '"></scr' + 'ipt>');
        });
     
        this.site.siteConfig.metaTags.forEach((metaTag: IMetaTag) => {
            new NewTag({
                tagName: 'meta',
                parent: document.head,
                attributes: metaTag,
                replaceQuery: '[name="' + metaTag.name + '"]'
            }).tag;
        });

        this.site.siteConfig.linkTags.forEach((linkTag: ILinkTag) => {
            new NewTag({
                tagName: 'link',
                parent: document.head,
                attributes: linkTag,
                replaceQuery: (linkTag.name ? '[name="' + linkTag.name + '"]' : null)
            }).tag;
        });

        new NewTag({
            tagName: 'style',
            parent: document.head,
            attributes: {
                type: 'text/css'
            },
            inner: {
                html: this.site.siteConfig.css
            }
        }).tag;

        new NewTag({
            tagName: 'div',
            parent: document.body,
            attributes: {
                id: 'site'
            },
            inner: {
                html: this.site.siteConfig.html
            }
        }).tag;

        this.renderPage();
    }
}

interface INewTag {
    tagName: string;
    parent: any;
    attributes: {
        [attribute: string]: string
    };
    inner ? : {
        text ? : string,
        html ? : string
    };
    replaceQuery ? : string;
}

class NewTag implements INewTag {
    tagName: string = 'div';
    parent: any = document.body;
    attributes: {
        [attribute: string]: string
    } = {};
    inner: {
        text ? : string,
        html ? : string
    } = {};
    replaceQuery ? : string = this.tagName + ' dinnay-exist';
    private _tag: any = null;
    get tag(): any {
        if (!this._tag) {
            var tag = this.parent.querySelector(this.replaceQuery) || document.createElement(this.tagName);

            while (tag.attributes.length > 0) {
                tag.removeAttribute(tag.attributes[0].name);
            }

            // Add new attributes
            Object.keys(this.attributes).forEach((key) => {
                tag.setAttribute(key, this.attributes[key]);
            });

            if (this.inner.html) { // If we have some HTML to insert, insert it
                tag.innerHTML = this.inner.html;
            } else if (this.inner.text) { // If we have some Text to insert, insert it
                tag.innerText = this.inner.text;
            }

            // If tag isn't on page append it
            if (!tag.parent) {
                this.parent.appendChild(tag);
            }

            console.log(tag);

            this._tag = tag;
        }
        return this._tag;
    }
    constructor(newTag: INewTag) {
        Object.assign(this, newTag);
    }
}

interface IScvoSite {
    siteConfig: ISiteConfig,
    routeMatch: IRouteMatch
}

export interface ISiteConfig {
    hbs: string;
    scss: string;
    title: string;
    metaTags: IMetaTag[];
    linkTags: ILinkTag[];
    routing: IRoutes;
    menus: IMenus;
    metaData: any;
    css: string;
    html: string;
    scripts: string[];
}

export interface IMenus {
    [menu: string]: IMenuItem[];
}

export interface IMenuItem {
    label: string;
    path: string;
    subMenu: IMenuItem[];
}

export interface IMetaTag {
    name: string;
    content: string;
    [attribute: string]: string;
}

export interface ILinkTag {
    rel: string;
    type: string;
    href: string;
    [attribute: string]: string;
}
