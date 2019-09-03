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
var TaskSalesforceBulk = /** @class */ (function (_super) {
    __extends(TaskSalesforceBulk, _super);
    function TaskSalesforceBulk(connections) {
        var _this = _super.call(this) || this;
        _this.connections = connections;
        return _this;
    }
    TaskSalesforceBulk.prototype.execute = function (routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function () {
            var config, connection, sfClient, loginResponse, template, rendered, records, pageSize, results, pageCount, currentPage, page, pageResults, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!renderer) {
                            throw new Error('No renderer specified');
                        }
                        config = routeTaskConfig.config;
                        connection = this.connections[config.connection];
                        routeMatch.log('Creating Salesforce client and logging in', connection);
                        sfClient = new jsforce.Connection({ loginUrl: connection.loginUrl });
                        return [4 /*yield*/, sfClient.login(connection.username, connection.password)];
                    case 1:
                        loginResponse = _a.sent();
                        routeMatch.log('Salesforce login response:', loginResponse);
                        template = routeMatch.getString(config.recordsTemplate);
                        return [4 /*yield*/, renderer.render(template, routeMatch)];
                    case 2:
                        rendered = _a.sent();
                        records = typeof rendered === 'string' ?
                            JSON.parse(rendered) :
                            rendered;
                        routeMatch.log('Got records', records.slice(0, 10), '...[', records.length, 'total records]');
                        pageSize = config.pageSize || 500;
                        results = [];
                        pageCount = Math.ceil(records.length / pageSize);
                        currentPage = 0;
                        _a.label = 3;
                    case 3:
                        if (!(records.length > 0)) return [3 /*break*/, 8];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        page = records.splice(0, pageSize);
                        routeMatch.log("About to batch page " + ++currentPage + " of " + pageCount + ", which contains " + page.length + " records");
                        return [4 /*yield*/, this.executeBatch(page, config, sfClient, routeMatch)];
                    case 5:
                        pageResults = _a.sent();
                        results.push(pageResults);
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        routeMatch.error(err_1, "Exception encountered on page " + currentPage + " of " + pageCount);
                        return [3 /*break*/, 7];
                    case 7:
                        routeMatch.log("Finished batching page " + currentPage + " of " + pageCount + ". " + results.length + " total results so far");
                        return [3 /*break*/, 3];
                    case 8:
                        routeMatch.setData(results);
                        routeMatch.log('Done, returning CONTINUE command');
                        return [2 /*return*/, { command: task_base_1.TaskResultCommand.CONTINUE }];
                }
            });
        });
    };
    TaskSalesforceBulk.prototype.executeBatch = function (records, config, sfClient, routeMatch) {
        return new Promise(function (resolve, reject) {
            try {
                var job = sfClient.bulk.createJob(config.type, config.operation, config.bulkOptions);
                sfClient.bulk.pollInterval = 1000;
                sfClient.bulk.pollTimeout = 20000;
                var batch_1 = job.createBatch();
                batch_1.on('error', function (batchInfo) {
                    routeMatch.error(new Error('Batch Error'), 'Batch Error');
                    // reject(new BatchError('Batch Error', [batchInfo]));
                });
                batch_1.on('queue', function (batchInfo) {
                    batch_1.poll(1000, 20000);
                    routeMatch.log('Batch Queue:', batchInfo);
                });
                batch_1.on('response', function (rets) {
                    var errors = [];
                    var successes = [];
                    rets.forEach(function (ret) {
                        if (!ret.success) {
                            errors.push(ret);
                        }
                        else {
                            successes.push(ret);
                        }
                    });
                    routeMatch.log('Batch completed.', successes.length, 'succeeded, and', errors.length, 'failed.');
                    if (errors.length > 0) {
                        routeMatch.error(new BatchError('Failed operations', errors), 'Failed operations');
                    }
                    resolve({ successes: successes, errors: errors });
                });
                routeMatch.log('About to execute batch job on', records.length, 'records');
                batch_1.execute(records);
            }
            catch (err) {
                routeMatch.error(err, 'Failed to run batch job');
                reject(err);
            }
        });
    };
    return TaskSalesforceBulk;
}(task_base_1.TaskBase));
exports.TaskSalesforceBulk = TaskSalesforceBulk;
var BatchError = /** @class */ (function (_super) {
    __extends(BatchError, _super);
    function BatchError(message, operationErrors) {
        var _this = _super.call(this, message) || this;
        _this.operationErrors = operationErrors;
        return _this;
    }
    return BatchError;
}(Error));
exports.BatchError = BatchError;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-salesforce-bulk.js.map