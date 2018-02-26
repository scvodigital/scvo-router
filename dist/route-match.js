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
var hbs = require('clayhandlebars')();
var helpers_1 = require("./helpers");
var RouteMatch = /** @class */ (function () {
    function RouteMatch(route, params, context) {
        this.route = route;
        this.params = params;
        this.context = context;
        this.data = {};
        this.response = {
            contentType: 'application/json',
            contentBody: '{}',
            statusCode: 200
        };
        this.layoutName = 'default';
        this.route.tasks = this.route.tasks || [];
        helpers_1.Helpers.register(hbs);
        Object.keys(this.context.templatePartials).forEach(function (name) {
            hbs.registerPartial(name, context.templatePartials[name]);
        });
    }
    RouteMatch.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getLayoutName()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.runTasks()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.render()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        this.response.statusCode = 500;
                        this.response.contentType = 'application/json';
                        this.response.contentBody = JSON.stringify(err_1, null, 4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RouteMatch.prototype.getLayoutName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    console.log('#### ROUTEMATCH.getLayoutName() -> Getting layout name');
                    Object.keys(this.route.layouts).forEach(function (name) {
                        if (name === 'default' || _this.layoutName !== 'default')
                            return;
                        if (_this.context.layouts.hasOwnProperty(name)) {
                            var pattern = _this.context.layouts[name].pattern;
                            var regex = new RegExp(pattern, 'ig');
                            if (regex.test(_this.params.uri.href)) {
                                _this.layoutName = name;
                            }
                            else {
                            }
                        }
                    });
                    console.log('#### ROUTEMATCH.getLayoutName() -> Layout name:', this.layoutName);
                    return [2 /*return*/];
                }
                catch (err) {
                    console.error('#### RouteMatch -> Failed to get layout name:', err);
                    throw err;
                }
                return [2 /*return*/];
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
                        console.log('#### ROUTEMATCH.runTasks() -> Running tasks');
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < this.route.tasks.length)) return [3 /*break*/, 4];
                        task = this.route.tasks[i];
                        console.log('#### ROUTEMATCH.runTasks() -> Running task:', task.name, '| type:', task.taskType);
                        routerTask = this.context.routerTasks[task.taskType];
                        _a = this.data;
                        _b = task.name;
                        return [4 /*yield*/, routerTask.execute(task.config, this)];
                    case 2:
                        _a[_b] = _c.sent();
                        console.log('#### ROUTEMATCH.runTasks() -> Task completed:', task.name);
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log('#### ROUTEMATCH.runTasks() -> Tasks run. Date:', this.data);
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
    RouteMatch.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sections, layout, template, compiled;
            return __generator(this, function (_a) {
                try {
                    console.log('#### ROUTEMATCH.render() -> Rendering');
                    sections = {};
                    Object.keys(this.route.layouts[this.layoutName]).forEach(function (sectionName) {
                        var template = _this.route.layouts[_this.layoutName][sectionName];
                        var compiled = hbs.compile(template);
                        var output = compiled(_this);
                        var doNotStripDomains = _this.context.layouts[_this.layoutName].doNotStripDomains;
                        sections[sectionName] = output;
                    });
                    console.log('#### ROUTEMATCH.render() -> Route templates rendered');
                    console.log('#### ROUTEMATCH.render() -> Rendering  full layout');
                    layout = this.context.layouts[this.layoutName];
                    template = layout.template;
                    template = template.replace(/(<!--{section:)([a-z0-9_-]+)(}-->)/ig, function (match, m1, m2, m3) {
                        if (sections.hasOwnProperty(m2)) {
                            return sections[m2];
                        }
                        else {
                            return match;
                        }
                    });
                    compiled = hbs.compile(template);
                    console.log('#### ROUTEMATCH.render() -> All rendered');
                    this.response.contentType = layout.contentType || 'text/html';
                    this.response.contentBody = compiled(this);
                    return [2 /*return*/];
                }
                catch (err) {
                    console.error('#### RouteMatch -> Failed to render:', err);
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map