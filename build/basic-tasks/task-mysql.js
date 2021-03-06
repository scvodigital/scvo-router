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
var mysql = require("mysql");
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskMySQL = /** @class */ (function (_super) {
    __extends(TaskMySQL, _super);
    function TaskMySQL(connectionConfigs) {
        var _this = _super.call(this) || this;
        _this.connectionConfigs = connectionConfigs;
        return _this;
    }
    TaskMySQL.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, connectionConfig, connection, queryTemplateNames, q, queryTemplateName, queryTemplate, _a, _b, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        data = {};
                        connectionConfig = this.connectionConfigs[config.connectionName];
                        connection = mysql.createConnection(connectionConfig);
                        try {
                            connection.connect();
                        }
                        catch (err) {
                            routeMatch.error(err, 'Failed to connect to MySql');
                            throw err;
                        }
                        queryTemplateNames = Object.keys(config.queryTemplates);
                        q = 0;
                        _c.label = 1;
                    case 1:
                        if (!(q < queryTemplateNames.length)) return [3 /*break*/, 6];
                        queryTemplateName = queryTemplateNames[q];
                        queryTemplate = config.queryTemplates[queryTemplateName];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        _a = data;
                        _b = queryTemplateName;
                        return [4 /*yield*/, this.executeQuery(routeMatch, connection, queryTemplate, renderer)];
                    case 3:
                        _a[_b] = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _c.sent();
                        throw err_1;
                    case 5:
                        ++q;
                        return [3 /*break*/, 1];
                    case 6:
                        try {
                            connection.end();
                        }
                        catch (err) {
                            routeMatch.error(err, 'Failed to end connection to MySql');
                        }
                        routeMatch.data[routeTaskConfig.name] = data;
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskMySQL.prototype.executeQuery = function (routeMatch, connection, queryTemplate, renderer) {
        return new Promise(function (resolve, reject) {
            queryTemplate = routeMatch.getString(queryTemplate);
            renderer.render(queryTemplate, routeMatch)
                .then(function (query) {
                routeMatch.log('About to execute query:', query);
                connection.query(query, function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        return resolve(results);
                    }
                });
            })
                .catch(function (err) {
                return reject(err);
            });
        });
    };
    return TaskMySQL;
}(task_base_1.TaskBase));
exports.TaskMySQL = TaskMySQL;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-mysql.js.map