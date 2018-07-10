"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = __importStar(require("querystring"));
const deepExtend = require("deep-extend");
const dot = require("dot-object");
const task_base_1 = require("./task-base");
/* tslint:disable:no-any */
class RouteMatch {
    constructor(matchedRoute, request, context, taskModuleManager, rendererManager) {
        this.request = request;
        this.context = context;
        this.taskModuleManager = taskModuleManager;
        this.rendererManager = rendererManager;
        this.data = {};
        this.response = {
            contentType: 'application/json',
            body: '{}',
            statusCode: 200,
            headers: {},
            cookies: {},
        };
        this.errors = [];
        this.currentTask = null;
        this.currentTaskIndex = 0;
        this.reroutes = [];
        this.route = matchedRoute.config;
        this.route.tasks = this.route.tasks || [];
        this.response.cookies = request.cookies;
        this.response.statusCode = matchedRoute.config.defaultStatusCode || 200;
        this.mergeParams(matchedRoute.params);
    }
    get dp() {
        return '[' + this.route.name +
            (this.currentTask ? ' -> ' + this.currentTask.name : '') + ']';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            for (this.currentTaskIndex = 0; this.currentTaskIndex < this.route.tasks.length; ++this.currentTaskIndex) {
                try {
                    const taskConfig = this.route.tasks[this.currentTaskIndex];
                    if (typeof taskConfig === 'string') {
                        this.currentTask =
                            dot.pick(taskConfig, this.context);
                    }
                    else {
                        this.currentTask = this.route.tasks[this.currentTaskIndex];
                    }
                    console.log(this.dp, 'Current task index:', this.currentTaskIndex);
                    const taskModule = this.taskModuleManager.getTaskModule(this.currentTask.taskModule);
                    let renderer;
                    if (this.currentTask.renderer) {
                        renderer =
                            this.rendererManager.getRenderer(this.currentTask.renderer);
                    }
                    const taskResult = yield taskModule.execute(this, this.currentTask, renderer);
                    if (taskResult.command === task_base_1.TaskResultCommand.HALT) {
                        break;
                    }
                    else if (taskResult.command === task_base_1.TaskResultCommand.REROUTE) {
                        const redirectTo = taskResult.routeName || 'default';
                        this.reroute(redirectTo);
                    }
                }
                catch (err) {
                    console.error(this.dp, 'Problem with task:', err);
                    const errorRoute = err.errorRoute ||
                        this.currentTask.errorRoute ||
                        this.route.errorRoute || null;
                    if (errorRoute) {
                        this.reroute(errorRoute);
                    }
                }
            }
            this.currentTaskIndex = 0;
            this.currentTask = null;
            return this.response;
        });
    }
    reroute(routeName) {
        if (this.route.name === routeName) {
            throw new Error('A route cannot redirect to itself. Route name: ' + routeName);
        }
        this.reroutes.push(this.route);
        let redirectRoute = null;
        for (let r = 0; r < this.context.routes.length; ++r) {
            const routeConfig = this.context.routes[r];
            if (routeConfig.name === routeName) {
                redirectRoute = routeConfig;
                break;
            }
        }
        if (redirectRoute) {
            this.currentTaskIndex = -1;
            this.response.statusCode = redirectRoute.defaultStatusCode || 200;
            this.route = redirectRoute;
        }
        else {
            throw new Error('Redirect route not found. Route name: ' + routeName);
        }
    }
    mergeParams(matchedParams) {
        const params = {};
        const uri = this.request.url;
        Object.assign(params, this.route.defaultParams);
        Object.assign(params, matchedParams);
        let qs = uri.search || '?';
        qs = qs.substr(1);
        qs = qs.replace(/(\[\])|(%5B%5D)/ig, '');
        const query = querystring.parse(qs, this.route.queryDelimiter, this.route.queryEquals);
        let idFriendlyPath = (uri.pathname || '').replace(/\//g, '_');
        if (idFriendlyPath.startsWith('_')) {
            idFriendlyPath = idFriendlyPath.substr(1);
        }
        deepExtend(params, { query, path: idFriendlyPath, uri });
        this.request.params = params;
    }
    getString(pathOrVal) {
        if (pathOrVal.indexOf('>') === 0 && pathOrVal.indexOf('\n') === -1) {
            const path = pathOrVal.substr(1);
            const val = dot.pick(path, this);
            if (!val) {
                console.log(this.dp, 'No value found at:', path);
            }
            return val;
        }
        else {
            return pathOrVal;
        }
    }
}
exports.RouteMatch = RouteMatch;
/* tslint:enable:no-any */
//# sourceMappingURL=route-match.js.map