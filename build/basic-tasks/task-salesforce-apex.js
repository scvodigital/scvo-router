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
var jsforce = __importStar(require("jsforce"));
var task_base_1 = require("../task-base");
/* tslint:disable:no-any */
var TaskSalesforceApex = /** @class */ (function (_super) {
    __extends(TaskSalesforceApex, _super);
    function TaskSalesforceApex(connections) {
        var _this = _super.call(this) || this;
        _this.connections = connections;
        return _this;
    }
    TaskSalesforceApex.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, connection, sfClient, loginResponse, body, apexClassPath, method, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = routeTaskConfig.config;
                        connection = this.connections[config.connection];
                        routeMatch.log('Creating Salesforce client and logging in', connection);
                        sfClient = new jsforce.Connection({ loginUrl: connection.loginUrl });
                        return [4 /*yield*/, sfClient.login(connection.username, connection.password)];
                    case 1:
                        loginResponse = _a.sent();
                        routeMatch.log('Salesforce login response:', loginResponse);
                        if (!config.body) return [3 /*break*/, 3];
                        body = routeMatch.getObject(config.body);
                        if (!(typeof body === 'string')) return [3 /*break*/, 3];
                        return [4 /*yield*/, renderer.render(body, routeMatch)];
                    case 2:
                        body = _a.sent();
                        body = JSON.parse(body);
                        _a.label = 3;
                    case 3:
                        apexClassPath = routeMatch.getObject(config.apexClassPath);
                        return [4 /*yield*/, renderer.render(apexClassPath, routeMatch)];
                    case 4:
                        apexClassPath =
                            _a.sent();
                        method = config.method.toLowerCase();
                        routeMatch.log('Requesting Apex Class:', apexClassPath, '| method', config.method, '| body:', body);
                        return [4 /*yield*/, sfClient.apex[method](apexClassPath, body)];
                    case 5:
                        // All methods seem have the same signature
                        output = _a.sent();
                        if (config.output === 'data') {
                            routeMatch.data[routeTaskConfig.name] = output;
                        }
                        else if (config.output === 'body') {
                            routeMatch.response.body = output;
                        }
                        else {
                            throw new Error('No output specified');
                        }
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    return TaskSalesforceApex;
}(task_base_1.TaskBase));
exports.TaskSalesforceApex = TaskSalesforceApex;
//# sourceMappingURL=task-salesforce-apex.js.map