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
const date_fns_1 = require("date-fns");
const stringify = require("json-stringify-safe");
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
            clearCookies: {}
        };
        this.errors = [];
        this.logs = [];
        this.currentTask = null;
        this.currentTaskIndex = 0;
        this.reroutes = [];
        this.route = matchedRoute.config;
        this.route.tasks = this.route.tasks || [];
        this.response.statusCode = matchedRoute.config.defaultStatusCode || 200;
        this.mergeParams(matchedRoute.params);
    }
    get dp() {
        const currentTaskLabel = this.currentTask ?
            '(' + this.currentTaskIndex + ') ' + this.currentTask.name :
            '';
        return '[' + this.route.name +
            (this.currentTask ? ' -> ' + currentTaskLabel : '') + ']';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Started executing route');
            for (this.currentTaskIndex = 0; this.currentTaskIndex < this.route.tasks.length; ++this.currentTaskIndex) {
                try {
                    const taskConfig = this.route.tasks[this.currentTaskIndex];
                    if (typeof taskConfig === 'string') {
                        this.currentTask =
                            dot.pick(taskConfig, this);
                    }
                    else {
                        this.currentTask = this.route.tasks[this.currentTaskIndex];
                    }
                    this.log('Current task index:', this.currentTaskIndex);
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
                    this.error(err);
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
            this.log('Finished executing route');
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
            this.log('Getting string from:', path);
            const val = dot.pick(path, this);
            if (!val) {
                this.log('No value found at:', path);
            }
            return val;
        }
        else {
            return pathOrVal;
        }
    }
    setData(data) {
        if (this.currentTask === null) {
            console.error('This should not have happened! Setting task data when there is no task');
            return;
        }
        const taskName = this.currentTask.name;
        this.data[taskName] = data;
    }
    log(...args) {
        if (this.route.debug) {
            const timestamp = date_fns_1.format(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS');
            console.log(this.dp, ...args);
            const logMessageLines = [this.dp + ' ' + timestamp];
            for (let a = 0; a < arguments.length; ++a) {
                const arg = arguments[a];
                logMessageLines.push(a + ': ' + stringify(arg, null, 4));
            }
            const logMessage = logMessageLines.join('\n');
            this.logs.push(logMessage);
        }
    }
    error(error, message = 'No additional message provided') {
        const timestamp = new Date();
        if (this.currentTask === null) {
            console.error('This should not have happened! Task error with no task! Here\'s the error anyway:', error);
            return;
        }
        if (this.route.debug) {
            console.error(this.dp, error, message);
        }
        const taskError = {
            timestamp,
            routeName: this.route.name,
            taskName: this.currentTask.name,
            taskIndex: this.currentTaskIndex,
            error,
            message
        };
        this.errors.push(taskError);
    }
}
exports.RouteMatch = RouteMatch;
/* tslint:enable:no-any */
//# sourceMappingURL=route-match.js.map