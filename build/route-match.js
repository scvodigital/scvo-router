"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = __importStar(require("querystring"));
var deepExtend = require("deep-extend");
var dot = require("dot-object");
var date_fns_1 = require("date-fns");
var stringify = require("json-stringify-safe");
var task_base_1 = require("./task-base");
/* tslint:disable:no-any */
var RouteMatch = /** @class */ (function () {
    function RouteMatch(matchedRoute, request, context, taskModuleManager, rendererManager) {
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
            clearCookies: {},
            doNotZip: false
        };
        this.errors = [];
        this.logs = [];
        this.currentTask = null;
        this.currentTaskIndex = 0;
        this.reroutes = [];
        this.route = matchedRoute.config;
        this.route.tasks = this.route.tasks || [];
        this.response.statusCode = matchedRoute.config.defaultStatusCode || 200;
        this.response.doNotZip = this.route.hasOwnProperty('doNotZip') ?
            Boolean(matchedRoute.config.doNotZip) :
            false;
        this.mergeParams(matchedRoute.params);
    }
    Object.defineProperty(RouteMatch.prototype, "dp", {
        get: function () {
            var currentTaskLabel = this.currentTask ?
                '(' + this.currentTaskIndex + ') ' + this.currentTask.name :
                '';
            return '[' + this.request.url.host + ' | ' + this.route.name +
                (this.currentTask ? ' -> ' + currentTaskLabel : '') + ']';
        },
        enumerable: true,
        configurable: true
    });
    RouteMatch.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var taskConfig, taskModule, renderer, taskResult, redirectTo, err_1, errorRoute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log('Started executing route');
                        this.currentTaskIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(this.currentTaskIndex < this.route.tasks.length)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        taskConfig = this.route.tasks[this.currentTaskIndex];
                        if (typeof taskConfig === 'string') {
                            this.currentTask =
                                dot.pick(taskConfig, this);
                        }
                        else {
                            this.currentTask = this.route.tasks[this.currentTaskIndex];
                        }
                        this.log('Current task index:', this.currentTaskIndex);
                        taskModule = this.taskModuleManager.getTaskModule(this.currentTask.taskModule);
                        renderer = void 0;
                        if (this.currentTask.renderer) {
                            renderer =
                                this.rendererManager.getRenderer(this.currentTask.renderer);
                        }
                        return [4 /*yield*/, taskModule.execute(this, this.currentTask, renderer)];
                    case 3:
                        taskResult = _a.sent();
                        if (taskResult.command === task_base_1.TaskResultCommand.HALT) {
                            return [3 /*break*/, 6];
                        }
                        else if (taskResult.command === task_base_1.TaskResultCommand.REROUTE) {
                            redirectTo = taskResult.routeName || 'default';
                            this.reroute(redirectTo);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        this.error(err_1);
                        errorRoute = err_1.errorRoute ||
                            this.currentTask.errorRoute ||
                            this.route.errorRoute || null;
                        if (errorRoute) {
                            this.reroute(errorRoute);
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        ++this.currentTaskIndex;
                        return [3 /*break*/, 1];
                    case 6:
                        this.currentTaskIndex = 0;
                        this.currentTask = null;
                        this.log('Finished executing route');
                        return [2 /*return*/, this.response];
                }
            });
        });
    };
    RouteMatch.prototype.reroute = function (routeName) {
        if (this.route.name === routeName) {
            throw new Error('A route cannot redirect to itself. Route name: ' + routeName);
        }
        this.reroutes.push(this.route);
        var redirectRoute = null;
        for (var r = 0; r < this.context.routes.length; ++r) {
            var routeConfig = this.context.routes[r];
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
    };
    RouteMatch.prototype.mergeParams = function (matchedParams) {
        var params = {};
        var uri = this.request.url;
        Object.assign(params, this.route.defaultParams);
        Object.assign(params, matchedParams);
        var qs = uri.search || '?';
        qs = qs.substr(1);
        qs = qs.replace(/(\[\])|(%5B%5D)/ig, '');
        var query = querystring.parse(qs, this.route.queryDelimiter, this.route.queryEquals);
        var idFriendlyPath = (uri.pathname || '').replace(/\//g, '_');
        if (idFriendlyPath.startsWith('_')) {
            idFriendlyPath = idFriendlyPath.substr(1);
        }
        deepExtend(params, { query: query, path: idFriendlyPath, uri: uri });
        this.request.params = params;
    };
    RouteMatch.prototype.getString = function (pathOrVal) {
        if (typeof pathOrVal !== 'string') {
            throw new Error('Path or Value is not a string');
        }
        else if (pathOrVal.indexOf('>') === 0 && pathOrVal.indexOf('\n') === -1) {
            var path = pathOrVal.substr(1);
            this.log('Getting string from:', path);
            var val = dot.pick(path, this);
            if (!val) {
                this.log('No value found at:', path);
            }
            return val;
        }
        else {
            return pathOrVal;
        }
    };
    RouteMatch.prototype.getObject = function (pathOrVal) {
        if (typeof pathOrVal === 'string' && pathOrVal.indexOf('>') === 0 &&
            pathOrVal.indexOf('\n') === -1) {
            var path = pathOrVal.substr(1);
            this.log('Getting object from:', path);
            var val = dot.pick(path, this);
            if (!val) {
                this.log('No value found at:', path);
            }
            return val;
        }
        else {
            return pathOrVal;
        }
    };
    RouteMatch.prototype.setData = function (data) {
        if (this.currentTask === null) {
            console.error('This should not have happened! Setting task data when there is no task');
            return;
        }
        var taskName = this.currentTask.name;
        this.data[taskName] = data;
    };
    RouteMatch.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.route.debug) {
            var timestamp = date_fns_1.format(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS');
            console.log.apply(console, [this.dp].concat(args));
            var logMessageLines = [this.dp + ' ' + timestamp];
            for (var a = 0; a < arguments.length; ++a) {
                var arg = arguments[a];
                logMessageLines.push(a + ': ' + stringify(arg, null, 4));
            }
            var logMessage = logMessageLines.join('\n');
            this.logs.push(logMessage);
        }
    };
    RouteMatch.prototype.error = function (error, message) {
        if (message === void 0) { message = 'No additional message provided'; }
        var timestamp = new Date();
        if (this.currentTask === null) {
            console.error('This should not have happened! Task error with no task! Here\'s the error anyway:', error);
            return;
        }
        if (this.route.debug) {
            console.error(this.dp, error, message);
        }
        var taskError = {
            timestamp: timestamp,
            routeName: this.route.name,
            taskName: this.currentTask.name,
            taskIndex: this.currentTaskIndex,
            error: error,
            message: message
        };
        this.errors.push(taskError);
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
/* tslint:enable:no-any */ 
//# sourceMappingURL=route-match.js.map