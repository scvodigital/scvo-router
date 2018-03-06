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
var util = require("util");
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
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.response.statusCode = 500;
                        this.response.contentType = 'application/json';
                        this.response.body = JSON.stringify(err_1, null, 4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RouteMatch.prototype.runTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, task, routerTask, _a, _b, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < this.route.tasks.length)) return [3 /*break*/, 4];
                        task = this.route.tasks[i];
                        routerTask = this.context.routerTasks[task.taskType];
                        _a = this.data;
                        _b = task.name;
                        return [4 /*yield*/, routerTask.execute(this, task.config)];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: 
                    //console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
                    return [2 /*return*/];
                    case 5:
                        err_2 = _c.sent();
                        console.error('#### RouteMatch -> Failed to run tasks:', err_2);
                        throw err_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RouteMatch.prototype.runDestination = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routerDestination, response, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('#### RouteMatch.runDestination ->', util.inspect(this, false, null, true));
                        routerDestination = this.context.routerDestinations[this.route.destination.destinationType];
                        return [4 /*yield*/, routerDestination.execute(this)];
                    case 1:
                        response = _a.sent();
                        Object.assign(this.response, response);
                        this.response.cookies = response.cookies; // Overwriting these in case cookies are cleared in the response
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.error('#### RouteMatch -> Failed to run destination:', err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map