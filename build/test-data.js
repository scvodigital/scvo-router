"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Url = __importStar(require("url"));
/* tslint:disable */
exports.TestSite = {
    name: 'Test Site',
    domains: ['test-site.com'],
    metaData: {
        handlebarsPartials: { hello_world: '<h1>Hello, World.</h1>' },
        handlebarsTemplates: {
            layouts: {
                default: '<html><head><title>{{route.metaData.title}}</title>{{{layoutParts.head}}}</head><body>{{{layoutParts.body}}}</body></html>',
                rss: '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>{{{layoutParts.head}}}{{{layoutParts.items}}}</channel></rss>'
            },
            templates: {
                standard_page_body: '<h1>{{route.metaData.title}}</h1><p>I am a standard page</p><p>Total Jobs: {{data.search.hits.total}}',
                standard_page_head: '<meta name="description" content="I am page">'
            }
        },
        title: 'Test site'
    },
    routes: [
        {
            name: 'index',
            metaData: { title: 'Index Page!' },
            acceptedVerbs: ['GET'],
            queryDelimiter: '&',
            queryEquals: '=',
            defaultParams: {},
            pattern: '/index',
            tasks: [
                {
                    name: 'search',
                    taskModule: 'request',
                    renderer: 'handlebars',
                    config: {
                        options: {
                            url: 'https://2e6b5fd9344d4f8565e7d015d861b240.europe-west3.gcp.cloud.es.io:9243/web-content-production/goodmoves-vacancy/_search?_source=title',
                            auth: { username: 'readonly', password: 'onlyread' },
                            method: 'GET',
                            json: true
                        }
                    }
                },
                {
                    name: 'render',
                    taskModule: 'layoutRender',
                    renderer: 'handlebars',
                    config: {
                        logic: { 'if': [true, 'default'] },
                        layouts: {
                            default: {
                                parts: {
                                    body: '>context.metaData.handlebarsTemplates.templates.standard_page_body',
                                    head: '>context.metaData.handlebarsTemplates.templates.standard_page_head'
                                },
                                layout: '>context.metaData.handlebarsTemplates.layouts.default'
                            }
                        },
                        output: 'body'
                    }
                }
            ]
        },
        {
            name: 'four_oh_four',
            metaData: {},
            acceptedVerbs: ['GET'],
            queryDelimiter: '&',
            queryEquals: '=',
            defaultParams: {},
            pattern: '/404',
            tasks: []
        },
        {
            name: 'default',
            metaData: {},
            acceptedVerbs: ['GET'],
            queryDelimiter: '&',
            queryEquals: '=',
            defaultParams: {},
            pattern: '/*path',
            tasks: []
        }
    ]
};
exports.TestGetIndexRequest = {
    verb: 'GET',
    params: {},
    url: Url.parse('https://test-site.com/index?param1=test&param1=more&param2=other-data'),
    body: {},
    cookies: {},
    headers: {},
    fullUrl: 'https://test-site.com/index?param1=test&param1=more&param2=other-data'
};
/* tslint:enable */
//# sourceMappingURL=test-data.js.map