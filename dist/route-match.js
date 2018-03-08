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
var route_errors_1 = require("./route-errors");
var RouteMatch = /** @class */ (function () {
    function RouteMatch(route, request, context) {
        this.route = route;
        this.request = request;
        this.context = context;
        this.data = {};
        this.response = {
            contentType: 'application/json',
            body: '{}',
            statusCode: 200,
            headers: {},
            cookies: {},
        };
        this.layoutName = 'default';
        this.errors = [];
        this.route.tasks = this.route.tasks || [];
        this.response.cookies = request.cookies;
    }
    RouteMatch.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.runTasks()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.runDestination()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.response];
                    case 3:
                        err_1 = _a.sent();
                        if (!(err_1 instanceof route_errors_1.RouteError)) {
                            err_1 = new route_errors_1.RouteError(err_1, {
                                statusCode: 500,
                                sourceRoute: this,
                                redirectTo: this.route.errorRoute || null,
                                data: {}
                            });
                        }
                        this.errors.push(err_1);
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RouteMatch.prototype.runTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, task, routerTask, _a, _b, err_2, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < this.route.tasks.length)) return [3 /*break*/, 6];
                        task = this.route.tasks[i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        routerTask = this.context.routerTasks[task.taskType];
                        _a = this.data;
                        _b = task.name;
                        return [4 /*yield*/, routerTask.execute(this, task)];
                    case 3:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _c.sent();
                        if (!(err_2 instanceof route_errors_1.RouteTaskError)) {
                            err_2 = new route_errors_1.RouteTaskError(err_2, {
                                statusCode: 500,
                                sourceRoute: this,
                                task: task,
                                redirectTo: task.errorRoute || this.route.errorRoute || null,
                                data: {}
                            });
                        }
                        else {
                            err_2.redirectTo = err_2.redirectTo || task.errorRoute || this.route.errorRoute || null;
                        }
                        if (err_2.redirectTo) {
                            throw err_2;
                        }
                        else {
                            console.log('#### RouteMatch.runTasks() -> Task error (but continuing):', err_2);
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: 
                    //console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
                    return [2 /*return*/];
                    case 7:
                        err_3 = _c.sent();
                        if (!(err_3 instanceof route_errors_1.RouteError)) {
                            err_3 = new route_errors_1.RouteError(err_3, {
                                statusCode: 500,
                                sourceRoute: this,
                                redirectTo: this.route.errorRoute || null,
                                data: {}
                            });
                        }
                        else {
                            err_3.redirectTo = err_3.redirectTo || this.route.errorRoute || null;
                        }
                        console.error('#### RouteMatch -> Failed to run tasks:', err_3);
                        throw err_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RouteMatch.prototype.runDestination = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routerDestination, response, err_4, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        routerDestination = this.context.routerDestinations[this.route.destination.destinationType];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, routerDestination.execute(this)];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        if (!(err_4 instanceof route_errors_1.RouteDestinationError)) {
                            err_4 = new route_errors_1.RouteDestinationError(err_4, {
                                statusCode: 500,
                                sourceRoute: this,
                                destination: this.route.destination,
                                redirectTo: this.route.errorRoute || null,
                                data: {}
                            });
                        }
                        else {
                            err_4.redirectTo = err_4.redirectTo || this.route.errorRoute || null;
                        }
                        throw err_4;
                    case 4:
                        //console.log('#### ROUTEMATCH.runDestination() -> Destination completed:');
                        Object.assign(this.response, response);
                        this.response.cookies = response.cookies; // Overwriting these in case cookies are cleared in the response
                        return [3 /*break*/, 6];
                    case 5:
                        err_5 = _a.sent();
                        if (!(err_5 instanceof route_errors_1.RouteError)) {
                            err_5 = new route_errors_1.RouteError(err_5, {
                                statusCode: 500,
                                sourceRoute: this,
                                redirectTo: this.route.errorRoute || null,
                                data: {}
                            });
                        }
                        else {
                            err_5.redirectTo = err_5.redirectTo || this.route.errorRoute || null;
                        }
                        console.error('#### RouteMatch -> Failed to run destination:', err_5);
                        throw err_5;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map