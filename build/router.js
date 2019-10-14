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
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var dot = require("dot-object");
var registered_route_1 = require("./registered-route");
var renderer_manager_1 = require("./renderer-manager");
var route_match_1 = require("./route-match");
var task_module_manager_1 = require("./task-module-manager");
var cache_manager_1 = require("./cache-manager");
// const routerConfigurationSchema =
// require('./router-configuration.schema.json');
/* tslint:disable:no-any */
var Router = /** @class */ (function () {
    function Router(context, taskModuleMap, rendererMap) {
        var _this = this;
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
        this.cacheManager = new cache_manager_1.CacheManager();
        this.checkResponses = [];
        this.taskModuleManager = new task_module_manager_1.TaskModuleManager(taskModuleMap);
        this.rendererManager = new renderer_manager_1.RendererManager(rendererMap);
        this.checkConfiguration();
        if (!this.hasErrors) {
            context.routes.forEach(function (route) {
                var registeredRoute = new registered_route_1.RegisteredRoute(route);
                _this.registeredRoutes.push(registeredRoute);
                if (route.name === 'default') {
                    _this.defaultRoute = route;
                }
            });
        }
    }
    Object.defineProperty(Router.prototype, "hasErrors", {
        get: function () {
            for (var i = 0; i < this.checkResponses.length; ++i) {
                var checkResponse = this.checkResponses[i];
                if (checkResponse.level === RouterConfigurationCheckResponseLevel.ERROR) {
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.checkConfiguration = function () {
        var _this = this;
        var ajv = new Ajv();
        var valid = true; // ajv.validate(routerConfigurationSchema, this.context);
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
        var routeNames = [];
        this.context.routes.forEach(function (route) {
            if (routeNames.indexOf(route.name) > -1) {
                _this.checkResponses.push({
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
                _this.checkResponses.push({
                    source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
                    location: route.name,
                    level: RouterConfigurationCheckResponseLevel.WARNING,
                    error: 'Possible reroute recursion',
                    solution: 'Change the errorRoute of this route to something other than itself'
                });
            }
            var taskNames = [];
            route.tasks.forEach(function (taskVal) {
                var task;
                if (typeof taskVal === 'string') {
                    if (taskVal.indexOf('context.') === 0) {
                        var newTaskPath = taskVal.replace(/^context\./, '');
                        task = dot.pick(newTaskPath, _this.context);
                    }
                }
                else {
                    task = taskVal;
                }
                if (!task)
                    return;
                if (taskNames.indexOf(task.name) > -1) {
                    _this.checkResponses.push({
                        source: RouterConfigurationCheckResponseSource.ROUTE_CONFIGURATION,
                        level: RouterConfigurationCheckResponseLevel.ERROR,
                        location: route.name,
                        error: 'Multiple tasks with the same name exist',
                        solution: 'Route task names MUST be unique, try renaming one of the route tasks called "' +
                            task.name + '"'
                    });
                }
                if (!_this.taskModuleManager.hasTaskModule(task.taskModule)) {
                    _this.checkResponses.push({
                        source: RouterConfigurationCheckResponseSource.ROUTE_TASK_CONFIGURATION,
                        location: route.name + ' -> ' + task.name,
                        level: RouterConfigurationCheckResponseLevel.ERROR,
                        error: 'Task Module "' + task.taskModule + '" does not exist',
                        solution: 'Check that a Task Module called "' + task.taskModule +
                            '" has been loaded and that its spelling is correct'
                    });
                }
                if (task.renderer &&
                    !_this.rendererManager.hasRenderFunction(task.renderer)) {
                    _this.checkResponses.push({
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
    };
    Router.prototype.go = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var matchedRoute, routeMatch, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.hasErrors) {
                            return [2 /*return*/, {
                                    body: JSON.stringify(this.checkResponses),
                                    contentType: 'application/json',
                                    cookies: {},
                                    headers: {},
                                    statusCode: 500,
                                    doNotZip: false
                                }];
                        }
                        matchedRoute = this.matchRoute(request);
                        routeMatch = new route_match_1.RouteMatch(matchedRoute, request, this.context, this.taskModuleManager, this.rendererManager, this.cacheManager);
                        return [4 /*yield*/, routeMatch.execute()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_1 = _a.sent();
                        if (!this.context.disasterResponse) {
                            return [2 /*return*/, {
                                    body: 'Server Error 500',
                                    contentType: 'text/html',
                                    cookies: {},
                                    headers: {},
                                    statusCode: 500,
                                    doNotZip: false
                                }];
                        }
                        else {
                            return [2 /*return*/, this.context.disasterResponse];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.matchRoute = function (request) {
        request.url.path =
            (request.url.path || '').replace(/\/(\?|$)/i, '$1') || '/';
        request.url.pathname =
            (request.url.pathname || '').replace(/\/(\?|$)/i, '$1') || '/';
        var match = null;
        for (var i = 0; i < this.registeredRoutes.length; ++i) {
            var route = this.registeredRoutes[i];
            match = route.test(request);
            if (match)
                break;
        }
        if (!match) {
            match = { config: this.defaultRoute, params: {} };
        }
        return match;
    };
    return Router;
}());
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