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
// System imports
var deepExtend = require("deep-extend");
var querystring = require("querystring");
var routeRecognizer = require('route-recognizer');
var route_errors_1 = require("./route-errors");
var route_match_1 = require("./route-match");
/**
 * Class for managing incoming requests, routing them to Elasticsearch queries,
 * and rendering output
 */
var Router = /** @class */ (function () {
    /**
     * Create a Router for matching routes and rendering responses
     * @param {RouteMap} routes The routes and their configurations we are matching against
     */
    function Router(context, routerTasks, routerDestinations) {
        var _this = this;
        this.context = context;
        this.name = '';
        this.domains = [];
        this.metaData = {};
        this.menus = {};
        this.routes = {};
        this.uaId = '';
        this.routerTasks = {};
        this.routerDestinations = {};
        /* tslint:enable:no-any */
        this.defaultResult = null;
        Object.assign(this, context);
        // console.log('#### ROUTER.constructor() -> Registering router tasks',
        // routerTasks);
        routerTasks.forEach(function (routerTask) {
            _this.routerTasks[routerTask.name] = routerTask;
        });
        routerDestinations.forEach(function (routerDestination) {
            _this.routerDestinations[routerDestination.name] = routerDestination;
        });
        // console.log('#### ROUTER.constructor() -> Router Tasks:',
        // util.inspect(this.routerTasks, false, null, true));
        // console.log('#### ROUTER.constructor() -> Same old router setup');
        // Setup our route recognizer
        this.routeRecognizer = new routeRecognizer();
        // Loop through each route in the current context
        Object.keys(this.routes).forEach(function (routeName) {
            // Create a new Route object
            var route = _this.routes[routeName];
            route.name = routeName;
            route.acceptedVerbs =
                !route.acceptedVerbs || route.acceptedVerbs.length === 0 ?
                    '*' :
                    route.acceptedVerbs;
            if (routeName === '_default') {
                // Treat routes called `_default` as the default handler
                _this.defaultResult = { handler: route, isDynamic: true, params: {} };
            }
            else {
                // Any other route needs to be added to our RouteRecognizer
                if (typeof route.pattern === 'string') {
                    var routeDef = { path: route.pattern, handler: route };
                    _this.routeRecognizer.add([routeDef], { as: routeName });
                }
                else {
                    Object.keys(route.pattern).forEach(function (suffix) {
                        var routeDef = {
                            path: route.pattern[suffix],
                            handler: route
                        };
                        _this.routeRecognizer.add([routeDef], { as: routeName + '_' + suffix });
                    });
                }
            }
        });
    }
    /**
     * Execute the route against a URI to get a matched route and rendered
     * responses
     * @param {string} uriString - The URI to be matched
     * @return {RouteMatch} The matched route with rendered results
     */
    Router.prototype.execute = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var routeMatch, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.matchRoute(request)];
                    case 1:
                        routeMatch = _a.sent();
                        console.log('[ROUTER], Request:', routeMatch.request.fullUrl, '| Match:', routeMatch.route.name);
                        return [4 /*yield*/, this.executeRoute(routeMatch)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.matchRoute = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, recognizedRoutes, validResults, firstResult, handler, params, query, idFriendlyPath, queryParams, routeMatch;
            return __generator(this, function (_a) {
                uri = request.url;
                recognizedRoutes = this.routeRecognizer.recognize(request.url.path || '') || null;
                validResults = [];
                if (recognizedRoutes) {
                    recognizedRoutes.slice(0).forEach(function (result) {
                        var route = result.handler;
                        if (route.acceptedVerbs === '*') {
                            validResults.push(result);
                        }
                        else {
                            if (route.acceptedVerbs.indexOf(request.verb) > -1) {
                                validResults.push(result);
                            }
                        }
                    });
                }
                firstResult = validResults[0] || this.defaultResult;
                handler = firstResult.handler;
                params = {};
                Object.assign(params, handler.defaultParams);
                Object.assign(params, firstResult.params);
                query = querystring.parse(uri.query, handler.queryDelimiter, handler.queryEquals);
                idFriendlyPath = (uri.pathname || '').replace(/\//g, '_');
                if (idFriendlyPath.startsWith('_')) {
                    idFriendlyPath = idFriendlyPath.substr(1);
                }
                queryParams = Object.keys(query);
                queryParams.forEach(function (param) {
                    if (param.indexOf('[]') === param.length - 2) {
                        var newParam = param.substr(0, param.length - 2);
                        var value = query[param];
                        if (typeof query[newParam] === 'undefined' || query[newParam] === null) {
                            query[newParam] = [value];
                        }
                        else if (!Array.isArray(query[newParam])) {
                            query[newParam] = [query[newParam], value];
                        }
                        delete query[param];
                    }
                });
                deepExtend(params, { query: query, path: idFriendlyPath, uri: uri });
                request.params = params;
                routeMatch = new route_match_1.RouteMatch(handler, request, this);
                return [2 /*return*/, routeMatch];
            });
        });
    };
    Router.prototype.executeRoute = function (routeMatch) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_2, newRoute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, routeMatch.execute()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        err_2 = _a.sent();
                        if (!(err_2 instanceof route_errors_1.RouteError)) {
                            err_2 = new route_errors_1.RouteError(err_2, {
                                statusCode: 500,
                                sourceRoute: routeMatch,
                                redirectTo: routeMatch.route.errorRoute,
                                data: {}
                            });
                        }
                        if (!this.routes.hasOwnProperty(err_2.redirectTo)) {
                            console.log('#### ROUTER.executeRoute() -> Error thrown in route "', routeMatch.route.name, '" but no where to redirect');
                            throw err_2;
                        }
                        newRoute = this.routes[err_2.redirectTo];
                        if (routeMatch.route.name === newRoute.name) {
                            console.log('#### ROUTER.executeRoute() -> Recursion detected! "', routeMatch.route.name, '" is redirecting to "', newRoute.name, '"');
                            throw err_2;
                        }
                        routeMatch.route = newRoute;
                        console.log('#### ROUTER.executeRoute() -> About to redirect:', routeMatch.route.name);
                        return [4 /*yield*/, this.executeRoute(routeMatch)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map