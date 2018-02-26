import * as util from 'util';

const hbs = require('clayhandlebars')();

import { 
    IRouteMatch, INamedPattern, 
    INamedTemplate, IContext, IMenus, IMenuItem,
    IRouteLayouts, IRouteLayout, IRouteResponse,
    IRoute
} from './interfaces';
import { Helpers } from './helpers';

export class RouteMatch implements IRouteMatch {
    data: any = {};
    response: IRouteResponse = {
        contentType: 'application/json',
        contentBody: '{}',
        statusCode: 200
    };
    layoutName: string = 'default';

    constructor(public route: IRoute, public params: any, public context: IContext) { 
        this.route.tasks = this.route.tasks || [];
        Helpers.register(hbs);
        Object.keys(this.context.templatePartials).forEach((name: string) => {
            hbs.registerPartial(name, context.templatePartials[name]);
        });
    }

    public async execute(): Promise<void> {
        try {
            await this.getLayoutName();   
            await this.runTasks();
            await this.render();
        } catch(err) {
            this.response.statusCode = 500;
            this.response.contentType = 'application/json';
            this.response.contentBody = JSON.stringify(err, null, 4);
        }
        return;
    }
   
    private async getLayoutName(): Promise<void> {
        try {
            //console.log('#### ROUTEMATCH.getLayoutName() -> Getting layout name');
            Object.keys(this.route.layouts).forEach((name: string) => {
                if (name === 'default' || this.layoutName !== 'default') return;
                if (this.context.layouts.hasOwnProperty(name)) {
                    var pattern = this.context.layouts[name].pattern;
                    var regex = new RegExp(pattern, 'ig');
                    if (regex.test(this.params.uri.href)) {
                        this.layoutName = name;
                    } else { 
                    }
                }
            });
            //console.log('#### ROUTEMATCH.getLayoutName() -> Layout name:', this.layoutName);
            return;
        } catch(err) {
            console.error('#### RouteMatch -> Failed to get layout name:', err);
            throw err;
        }
    }

    private async runTasks(): Promise<void> {
        try {
            //console.log('#### ROUTEMATCH.runTasks() -> Running tasks');
            for (let i = 0; i < this.route.tasks.length; i++) {
                var task = this.route.tasks[i];
                //console.log('#### ROUTEMATCH.runTasks() -> Running task:', task.name, '| type:', task.taskType);
                var routerTask = this.context.routerTasks[task.taskType];
                this.data[task.name] = await routerTask.execute(task.config, this);
                //console.log('#### ROUTEMATCH.runTasks() -> Task completed:', task.name);
            }
            //console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
            return;
        } catch(err) {
            console.error('#### RouteMatch -> Failed to run tasks:', err);
            throw err;
        }
    }

    private async render(): Promise<void> {
        try {
            //console.log('#### ROUTEMATCH.render() -> Rendering');

            var sections: IRouteLayout = {};
            Object.keys(this.route.layouts[this.layoutName]).forEach((sectionName: string) => {
                var template = this.route.layouts[this.layoutName][sectionName];
                var compiled = hbs.compile(template);
                var output = compiled(this);
                var doNotStripDomains = this.context.layouts[this.layoutName].doNotStripDomains;
                sections[sectionName] = output;
            });

            //console.log('#### ROUTEMATCH.render() -> Route templates rendered');
            //console.log('#### ROUTEMATCH.render() -> Rendering  full layout');
            
            var layout = this.context.layouts[this.layoutName];
            var template = layout.template;
            template = template.replace(/(<!--{section:)([a-z0-9_-]+)(}-->)/ig, (match, m1, m2, m3) => {
                if (sections.hasOwnProperty(m2)) {
                    return sections[m2];
                } else { 
                    return match;
                }
            });
            var compiled = hbs.compile(template);

            //console.log('#### ROUTEMATCH.render() -> All rendered');
            
            this.response.contentType = layout.contentType || 'text/html';
            this.response.contentBody = compiled(this);
            return;
        } catch(err) {
            console.error('#### RouteMatch -> Failed to render:', err);
            throw err;
        }
    }
}
