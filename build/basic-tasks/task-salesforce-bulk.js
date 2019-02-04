"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsforce = __importStar(require("jsforce"));
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskSalesforceBulk extends task_base_1.TaskBase {
    constructor(connections) {
        super();
        this.connections = connections;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const connection = this.connections[config.connection];
            routeMatch.log('Creating Salesforce client and logging in', connection);
            const sfClient = new jsforce.Connection({ loginUrl: connection.loginUrl });
            const loginResponse = yield sfClient.login(connection.username, connection.password);
            routeMatch.log('Salesforce login response:', loginResponse);
            const template = routeMatch.getString(config.recordsTemplate);
            const rendered = yield renderer.render(template, routeMatch);
            const records = typeof rendered === 'string' ?
                JSON.parse(rendered) :
                rendered;
            routeMatch.log('Got records', records.slice(0, 10), '...[', records.length, 'total records]');
            const results = yield this.executeBatch(records, config, sfClient, routeMatch);
            routeMatch.setData(results);
            routeMatch.log('Done, returning CONTINUE command');
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    executeBatch(records, config, sfClient, routeMatch) {
        return new Promise((resolve, reject) => {
            try {
                const job = sfClient.bulk.createJob(config.type, config.operation, config.bulkOptions);
                sfClient.bulk.pollInterval = 1000;
                sfClient.bulk.pollTimeout = 30000;
                const batch = job.createBatch();
                batch.on('error', (batchInfo) => {
                    reject(new BatchError('Batch Error', [batchInfo]));
                });
                batch.on('queue', (batchInfo) => {
                    // batch.poll(1000, 20000);
                    routeMatch.log('Batch Queue:', batchInfo);
                });
                batch.on('response', (rets) => {
                    const errors = [];
                    const successes = [];
                    rets.forEach((ret) => {
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
                    resolve({ successes, errors });
                });
                routeMatch.log('About to execute batch job on', records.length, 'records');
                batch.execute(records);
            }
            catch (err) {
                routeMatch.error(err, 'Failed to run batch job');
                reject(err);
            }
        });
    }
}
exports.TaskSalesforceBulk = TaskSalesforceBulk;
class BatchError extends Error {
    constructor(message, operationErrors) {
        super(message);
        this.operationErrors = operationErrors;
    }
}
exports.BatchError = BatchError;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-salesforce-bulk.js.map