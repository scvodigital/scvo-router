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
const DataTransform = require("node-json-transform");
const task_base_1 = require("../task-base");
class TaskTransform extends task_base_1.TaskBase {
    execute(routeMatch, routeTaskConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let cache = [];
            let data = JSON.parse(JSON.stringify(routeMatch, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Duplicate reference found
                        try {
                            // If this value does not reference a parent it can be deduped
                            return JSON.parse(JSON.stringify(value));
                        }
                        catch (error) {
                            // discard key if value cannot be deduped
                            return;
                        }
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }));
            cache = [];
            const maps = Array.isArray(routeTaskConfig.config) ?
                routeTaskConfig.config :
                [routeTaskConfig.config];
            for (let i = 0; i < maps.length; ++i) {
                const map = maps[i];
                const transformer = DataTransform.DataTransform(data, map);
                data = transformer.transform();
            }
            routeMatch.data[routeTaskConfig.name] = data;
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
}
exports.TaskTransform = TaskTransform;
/* tslint:enable:no-any */
//# sourceMappingURL=task-transform.js.map