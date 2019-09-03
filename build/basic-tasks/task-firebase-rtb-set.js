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
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskFirebaseRtbSet = /** @class */ (function (_super) {
    __extends(TaskFirebaseRtbSet, _super);
    function TaskFirebaseRtbSet(apps) {
        var _this = _super.call(this) || this;
        _this.apps = apps;
        return _this;
    }
    TaskFirebaseRtbSet.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, appName, pathTemplate, dataTemplate, app, path, dataJson, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        if (config.setOrUpdate !== 'set' && config.setOrUpdate !== 'update') {
                            throw new Error('No "setOrUpdate" property given');
                        }
                        appName = routeMatch.getString(config.appName);
                        if (!this.apps.hasOwnProperty(appName)) {
                            throw new Error('No Firebase app named "' + appName + '" registered');
                        }
                        pathTemplate = routeMatch.getString(config.pathTemplate);
                        dataTemplate = routeMatch.getString(config.dataTemplate);
                        app = this.apps[appName];
                        routeMatch.log('About to render path template', pathTemplate);
                        return [4 /*yield*/, renderer.render(pathTemplate, routeMatch)];
                    case 1:
                        path = _a.sent();
                        routeMatch.log('About to render dataTemplate');
                        return [4 /*yield*/, renderer.render(dataTemplate, routeMatch)];
                    case 2:
                        dataJson = _a.sent();
                        routeMatch.log('Rendered data template', dataJson);
                        data = JSON.parse(dataJson);
                        routeMatch.log('Data JSON parsed. Writing to firebase');
                        response = { path: path, data: data, setOrUpdate: config.setOrUpdate };
                        if (!(config.setOrUpdate === 'set')) return [3 /*break*/, 4];
                        return [4 /*yield*/, app.database().ref(path).set(data)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, app.database().ref(path).update(data)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        routeMatch.data[routeTaskConfig.name] = response;
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    return TaskFirebaseRtbSet;
}(task_base_1.TaskBase));
exports.TaskFirebaseRtbSet = TaskFirebaseRtbSet;
/* tslint:enable:no-any */
//# sourceMappingURL=task-firebase-rtb-set.js.map