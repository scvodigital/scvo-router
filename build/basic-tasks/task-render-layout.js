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
var jsonLogic = require("json-logic-js");
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskRenderLayout = /** @class */ (function (_super) {
    __extends(TaskRenderLayout, _super);
    function TaskRenderLayout(jsonLogicOperations) {
        var _this = _super.call(this) || this;
        if (jsonLogicOperations) {
            var operations = Object.keys(jsonLogicOperations);
            operations.forEach(function (operationName) {
                var operation = jsonLogicOperations[operationName];
                jsonLogic.add_operation(operationName, operation);
            });
        }
        return _this;
    }
    TaskRenderLayout.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, layoutName, layout, layoutPartOutputs, partNames, p, partName, partPathOrTemplate, partTemplate, partOutput, err_1, layoutTemplate, layoutOutput, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        layoutName = jsonLogic.apply(config.logic, routeMatch);
                        if (!config.layouts.hasOwnProperty(layoutName)) {
                            throw new Error('Layout with the name "' + layoutName + '" does not exist');
                        }
                        layout = config.layouts[layoutName];
                        layoutPartOutputs = {};
                        partNames = Object.keys(layout.parts);
                        p = 0;
                        _a.label = 1;
                    case 1:
                        if (!(p < partNames.length)) return [3 /*break*/, 7];
                        partName = partNames[p];
                        partPathOrTemplate = layout.parts[partName];
                        partTemplate = routeMatch.getString(partPathOrTemplate);
                        partOutput = '';
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, renderer.render(partTemplate, routeMatch)];
                    case 3:
                        partOutput = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.error('Failed to render part:', partName);
                        throw err_1;
                    case 5:
                        layoutPartOutputs[partName] = partOutput;
                        _a.label = 6;
                    case 6:
                        ++p;
                        return [3 /*break*/, 1];
                    case 7:
                        layoutTemplate = routeMatch.getString(layout.layout);
                        routeMatch.layoutParts = layoutPartOutputs;
                        layoutOutput = '';
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, renderer.render(layoutTemplate, routeMatch)];
                    case 9:
                        layoutOutput = _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _a.sent();
                        console.error('Failed to render layout:', layoutName);
                        throw err_2;
                    case 11:
                        delete routeMatch.layoutParts;
                        if (layout.contentType && layout.contentType.indexOf('json') > -1) {
                            layoutOutput = JSON.parse(layoutOutput);
                        }
                        if (config.output === 'data') {
                            routeMatch.data[routeTaskConfig.name] = layoutOutput;
                        }
                        else if (config.output === 'body') {
                            routeMatch.response.contentType = layout.contentType || 'text/html';
                            routeMatch.response.body = layoutOutput;
                        }
                        else {
                            throw new Error('No output specified');
                        }
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    return TaskRenderLayout;
}(task_base_1.TaskBase));
exports.TaskRenderLayout = TaskRenderLayout;
/* tslint:enable:no-any */
//# sourceMappingURL=task-render-layout.js.map