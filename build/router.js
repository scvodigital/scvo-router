"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const dot = require("dot-object");
const registered_route_1 = require("./registered-route");
const renderer_manager_1 = require("./renderer-manager");
const route_match_1 = require("./route-match");
const task_module_manager_1 = require("./task-module-manager");
// const routerConfigurationSchema =
// require('./router-configuration.schema.json');
/* tslint:disable:no-any */
class Router {
    constructor(context, taskModuleMap, rendererMap) {
        this.context = context;
        this.rendererMap = rendererMap;
        this.registeredRoutes = [];
        this.defaultRoute = {
            acceptedVerbs: ['GET'],
            defaultParams: {},
            metaData: {},
            name: 'default',
            pattern: '/',
            queryDelimiter: '&',
            queryEquals: '=',
            tasks: []
        };
        this.checkResponses = [];
        this.taskModuleManager = new task_module_manager_1.TaskModuleManager(taskModuleMap);
        this.rendererManager = new renderer_manager_1.RendererManager(rendererMap);
        this.checkConfiguration();
        if (!this.hasErrors) {
            context.routes.forEach((route) => {
                const registeredRoute = new registered_route_1.RegisteredRoute(route);
                this.registeredRoutes.push(registeredRoute);
                if (route.name === 'default') {
                    this.defaultRoute = route;
                }
            });
        }
    }
    get hasErrors() {
        for (let i = 0; i < this.checkResponses.length; ++i) {
            const checkResponse = this.checkResponses[i];
            if (checkResponse.level === RouterConfigurationCheckResponseLevel.ERROR) {
                return true;
            }
        }
        return false;
    }
    checkConfiguration() {
        const ajv = new Ajv();
        const valid = true; // ajv.validate(routerConfigurationSchema, this.context);
        if (!valid) {
            this.checkResponses.push({
                source: RouterConfigurationCheckResponseSource.ROUTER_CONFIGURATION,
                level: RouterConfigurationCheckResponseLevel.ERROR,
                location: 'root',
                error: 'Invalid Router Configuration: ' +
                    JSON.stringify(ajv.errors, null, 4),
                solution: 'The Router Configuration object that has been passed into the Router does not pass basic checks against the Router Configuration Schema. Please check the documentation and make sure you are passing in the correct object. No further checks will be performed'
            });
            return;
        }
        const routeNames = [];
        this.context.routes.forEach((route) => {
            if (routeNames.indexOf(route.name) > -1) {
                this.checkResponses.push({
                    source: RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
                    level: RouterConfigurationCheckResponseLevel.ERROR,
                    location: route.name,
                    error: 'Multiple routes with the same name',
                    solution: 'Route names MUST be unique, try renaming one of the routes called "' +
                        route.name + '"'
                });
            }
            else {
                routeNames.push(route.name);
            }
            if (route.errorRoute === route.name) {
                this.checkResponses.push({
                    source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
                    location: route.name,
                    level: RouterConfigurationCheckResponseLevel.WARNING,
                    error: 'Possible reroute recursion',
                    solution: 'Change the errorRoute of this route to something other than itself'
                });
            }
            const taskNames = [];
            route.tasks.forEach((taskVal) => {
                let task;
                if (typeof taskVal === 'string') {
                    if (taskVal.indexOf('context.') === 0) {
                        const newTaskPath = taskVal.replace(/^context\./, '');
                        task = dot.pick(newTaskPath, this.context);
                    }
                }
                else {
                    task = taskVal;
                }
                if (!task)
                    return;
                if (taskNames.indexOf(task.name) > -1) {
                    this.checkResponses.push({
                        source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
                        level: RouterConfigurationCheckResponseLevel.ERROR,
                        location: route.name,
                        error: 'Multiple tasks with the same name exist',
                        solution: 'Route task names MUST be unique, try renaming one of the route tasks called "' +
                            task.name + '"'
                    });
                }
                if (!this.taskModuleManager.hasTaskModule(task.taskModule)) {
                    this.checkResponses.push({
                        source: RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
                        location: route.name + ' -> ' + task.name,
                        level: RouterConfigurationCheckResponseLevel.ERROR,
                        error: 'Task Module "' + task.taskModule + '" does not exist',
                        solution: 'Check that a Task Module called "' + task.taskModule +
                            '" has been loaded and that its spelling is correct'
                    });
                }
                if (task.renderer &&
                    !this.rendererManager.hasRenderFunction(task.renderer)) {
                    this.checkResponses.push({
                        source: RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
                        location: route.name + ' -> ' + task.name,
                        level: RouterConfigurationCheckResponseLevel.ERROR,
                        error: 'Renderer "' + task.renderer + '" does not exist',
                        solution: 'Check that a Renderer called "' + task.renderer +
                            '" has been loaded and that its spelling is correct'
                    });
                }
            });
        });
    }
    go(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.hasErrors) {
                    return {
                        body: JSON.stringify(this.checkResponses),
                        contentType: 'application/json',
                        cookies: {},
                        headers: {},
                        statusCode: 500,
                        doNotZip: false
                    };
                }
                const matchedRoute = this.matchRoute(request);
                const routeMatch = new route_match_1.RouteMatch(matchedRoute, request, this.context, this.taskModuleManager, this.rendererManager);
                const response = yield routeMatch.execute();
                return response;
            }
            catch (err) {
                if (!this.context.disasterResponse) {
                    return {
                        body: 'Server Error 500',
                        contentType: 'text/html',
                        cookies: {},
                        headers: {},
                        statusCode: 500,
                        doNotZip: false
                    };
                }
                else {
                    return this.context.disasterResponse;
                }
            }
        });
    }
    matchRoute(request) {
        request.url.path =
            (request.url.path || '').replace(/\/(\?|$)/i, '$1') || '/';
        request.url.pathname =
            (request.url.pathname || '').replace(/\/(\?|$)/i, '$1') || '/';
        let match = null;
        for (let i = 0; i < this.registeredRoutes.length; ++i) {
            const route = this.registeredRoutes[i];
            match = route.test(request);
            if (match)
                break;
        }
        if (!match) {
            match = { config: this.defaultRoute, params: {} };
        }
        return match;
    }
}
exports.Router = Router;
var RouterConfigurationCheckResponseSource;
(function (RouterConfigurationCheckResponseSource) {
    RouterConfigurationCheckResponseSource[RouterConfigurationCheckResponseSource["ROUTER_CONFIGURATION"] = 0] = "ROUTER_CONFIGURATION";
    RouterConfigurationCheckResponseSource[RouterConfigurationCheckResponseSource["ROUTE_CONFIGURATION"] = 1] = "ROUTE_CONFIGURATION";
    RouterConfigurationCheckResponseSource[RouterConfigurationCheckResponseSource["ROUTE_TASK_CONFIGURATION"] = 2] = "ROUTE_TASK_CONFIGURATION";
    RouterConfigurationCheckResponseSource[RouterConfigurationCheckResponseSource["RENDERER"] = 3] = "RENDERER";
    RouterConfigurationCheckResponseSource[RouterConfigurationCheckResponseSource["TASK_MODULE"] = 4] = "TASK_MODULE";
})(RouterConfigurationCheckResponseSource = exports.RouterConfigurationCheckResponseSource || (exports.RouterConfigurationCheckResponseSource = {}));
var RouterConfigurationCheckResponseLevel;
(function (RouterConfigurationCheckResponseLevel) {
    RouterConfigurationCheckResponseLevel[RouterConfigurationCheckResponseLevel["INFO"] = 0] = "INFO";
    RouterConfigurationCheckResponseLevel[RouterConfigurationCheckResponseLevel["WARNING"] = 1] = "WARNING";
    RouterConfigurationCheckResponseLevel[RouterConfigurationCheckResponseLevel["ERROR"] = 2] = "ERROR";
})(RouterConfigurationCheckResponseLevel = exports.RouterConfigurationCheckResponseLevel || (exports.RouterConfigurationCheckResponseLevel = {}));
//# sourceMappingURL=router.js.map