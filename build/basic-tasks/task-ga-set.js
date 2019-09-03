"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ua = __importStar(require("universal-analytics"));
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskGASet = /** @class */ (function (_super) {
    __extends(TaskGASet, _super);
    function TaskGASet() {
        return _super.call(this) || this;
    }
    TaskGASet.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, visitorOptions, output, visitor, anyActions, _i, _a, action, params, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        return [4 /*yield*/, this.getObjectOrTemplate(config.options, config.optionsTemplate, renderer, routeMatch)];
                    case 1:
                        visitorOptions = _c.sent();
                        if (!visitorOptions) {
                            throw new Error('No visitor options');
                        }
                        output = { visitor: visitorOptions, actions: [] };
                        visitor = new ua.Visitor(visitorOptions);
                        anyActions = false;
                        _i = 0, _a = config.actions;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        action = _a[_i];
                        params = void 0;
                        _b = action.action;
                        switch (_b) {
                            case ('pageview'): return [3 /*break*/, 3];
                            case ('screenview'): return [3 /*break*/, 5];
                            case ('event'): return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch)];
                    case 4:
                        params = _c.sent();
                        output.actions.push({ action: action.action, params: params });
                        if (params) {
                            visitor.pageview(params);
                            anyActions = true;
                        }
                        return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch)];
                    case 6:
                        params = _c.sent();
                        output.actions.push({ action: action.action, params: params });
                        if (params) {
                            visitor.screenview(params);
                            anyActions = true;
                        }
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch)];
                    case 8:
                        params = _c.sent();
                        output.actions.push({ action: action.action, params: params });
                        if (params) {
                            visitor.event(params);
                            anyActions = true;
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        routeMatch.log('Invalid action', action);
                        _c.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11:
                        if (anyActions) {
                            visitor.send();
                        }
                        routeMatch.setData(output);
                        routeMatch.log('Returning CONTINUE command');
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskGASet.prototype.getObjectOrTemplate = function (obj, template, renderer, routeMatch) {
        return __awaiter(this, void 0, void 0, function () {
            var output, rendered;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        output = obj;
                        if (!template) return [3 /*break*/, 2];
                        template = routeMatch.getObject(template);
                        return [4 /*yield*/, renderer.render(template, routeMatch)];
                    case 1:
                        rendered = _a.sent();
                        if (typeof rendered === 'string') {
                            try {
                                output = JSON.parse(rendered);
                            }
                            catch (err) {
                                routeMatch.error(err, 'Because output could not be parsed as a UA params object, leaving output empty');
                            }
                        }
                        else {
                            output = rendered;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, output];
                }
            });
        });
    };
    return TaskGASet;
}(task_base_1.TaskBase));
exports.TaskGASet = TaskGASet;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-ga-set.js.map