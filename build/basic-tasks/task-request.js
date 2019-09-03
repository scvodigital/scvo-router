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
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise-native");
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskRequest = /** @class */ (function (_super) {
    __extends(TaskRequest, _super);
    function TaskRequest(secrets) {
        if (secrets === void 0) { secrets = {}; }
        var _this = _super.call(this) || this;
        _this.secrets = secrets;
        return _this;
    }
    TaskRequest.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, optionsMap, resolvedTemplates, _i, _a, name, optionsTemplate, _b, _c, resolvedOptions, _d, _e, name, options, outputs, _f, _g, name, options, output;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        optionsMap = {};
                        if (!routeTaskConfig.config.hasOwnProperty('optionsTemplates')) return [3 /*break*/, 5];
                        config = routeTaskConfig.config;
                        resolvedTemplates = routeMatch.getObject(config.optionsTemplates);
                        _i = 0, _a = Object.keys(resolvedTemplates);
                        _h.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name = _a[_i];
                        optionsTemplate = resolvedTemplates[name];
                        _b = optionsMap;
                        _c = name;
                        return [4 /*yield*/, this.getTemplateOptions(routeMatch, optionsTemplate, renderer)];
                    case 2:
                        _b[_c] = _h.sent();
                        _h.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        config = routeTaskConfig.config;
                        resolvedOptions = routeMatch.getObject(config.options);
                        for (_d = 0, _e = Object.keys(resolvedOptions); _d < _e.length; _d++) {
                            name = _e[_d];
                            options = resolvedOptions[name];
                            optionsMap[name] = routeMatch.getObject(options);
                        }
                        _h.label = 6;
                    case 6:
                        outputs = {};
                        _f = 0, _g = Object.keys(optionsMap);
                        _h.label = 7;
                    case 7:
                        if (!(_f < _g.length)) return [3 /*break*/, 10];
                        name = _g[_f];
                        options = optionsMap[name];
                        routeMatch.log('Requesting', options);
                        return [4 /*yield*/, request(options)];
                    case 8:
                        output = _h.sent();
                        outputs[name] = output;
                        _h.label = 9;
                    case 9:
                        _f++;
                        return [3 /*break*/, 7];
                    case 10:
                        routeMatch.setData(outputs);
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskRequest.prototype.getTemplateOptions = function (routeMatch, config, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var optionsTemplate, optionsString, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        optionsTemplate = routeMatch.getObject(config);
                        routeMatch.secrets = this.secrets;
                        return [4 /*yield*/, renderer.render(optionsTemplate, routeMatch)];
                    case 1:
                        optionsString = _a.sent();
                        delete routeMatch.secrets;
                        routeMatch.log('optionsString is: ', optionsString);
                        options = typeof optionsString === 'string' ?
                            JSON.parse(optionsString) :
                            optionsString;
                        return [2 /*return*/, options];
                }
            });
        });
    };
    return TaskRequest;
}(task_base_1.TaskBase));
exports.TaskRequest = TaskRequest;
//# sourceMappingURL=task-request.js.map