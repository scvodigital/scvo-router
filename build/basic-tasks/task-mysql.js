"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskMySQL extends task_base_1.TaskBase {
    constructor(connectionConfigs) {
        super();
        this.connectionConfigs = connectionConfigs;
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const data = {};
            const connectionConfig = this.connectionConfigs[config.connectionName];
            const connection = mysql.createConnection(connectionConfig);
            try {
                connection.connect();
            }
            catch (err) {
                routeMatch.error(err, 'Failed to connect to MySql');
                throw err;
            }
            const queryTemplateNames = Object.keys(config.queryTemplates);
            for (let q = 0; q < queryTemplateNames.length; ++q) {
                const queryTemplateName = queryTemplateNames[q];
                const queryTemplate = config.queryTemplates[queryTemplateName];
                try {
                    data[queryTemplateName] = yield this.executeQuery(routeMatch, connection, queryTemplate, renderer);
                }
                catch (err) {
                    throw err;
                }
            }
            try {
                connection.end();
            }
            catch (err) {
                routeMatch.error(err, 'Failed to end connection to MySql');
            }
            routeMatch.data[routeTaskConfig.name] = data;
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    executeQuery(routeMatch, connection, queryTemplate, renderer) {
        return new Promise((resolve, reject) => {
            queryTemplate = routeMatch.getString(queryTemplate);
            renderer.render(queryTemplate, routeMatch)
                .then((query) => {
                routeMatch.log('About to execute query:', query);
                connection.query(query, (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        return resolve(results);
                    }
                });
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
}
exports.TaskMySQL = TaskMySQL;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-mysql.js.map