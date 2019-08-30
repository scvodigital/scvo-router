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
const ua = __importStar(require("universal-analytics"));
const task_base_1 = require("../task-base");
/* tslint:disable:no-any */
class TaskGASet extends task_base_1.TaskBase {
    constructor() {
        super();
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const visitorOptions = yield this.getObjectOrTemplate(config.options, config.optionsTemplate, renderer, routeMatch);
            if (!visitorOptions) {
                throw new Error('No visitor options');
            }
            const output = { visitor: visitorOptions, actions: [] };
            const visitor = new ua.Visitor(visitorOptions);
            let anyActions = false;
            for (const action of config.actions) {
                let params;
                switch (action.action) {
                    case ('pageview'):
                        params = yield this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch);
                        output.actions.push({ action: action.action, params });
                        if (params) {
                            visitor.pageview(params);
                            anyActions = true;
                        }
                        break;
                    case ('screenview'):
                        params = yield this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch);
                        output.actions.push({ action: action.action, params });
                        if (params) {
                            visitor.screenview(params);
                            anyActions = true;
                        }
                        break;
                    case ('event'):
                        params = yield this.getObjectOrTemplate(action.parameters, action.template, renderer, routeMatch);
                        output.actions.push({ action: action.action, params });
                        if (params) {
                            visitor.event(params);
                            anyActions = true;
                        }
                        break;
                    default:
                        routeMatch.log('Invalid action', action);
                }
            }
            if (anyActions) {
                visitor.send();
            }
            routeMatch.setData(output);
            routeMatch.log('Returning CONTINUE command');
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    getObjectOrTemplate(obj, template, renderer, routeMatch) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = obj;
            if (template) {
                template = routeMatch.getObject(template);
                const rendered = yield renderer.render(template, routeMatch);
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
            }
            return output;
        });
    }
}
exports.TaskGASet = TaskGASet;
/* tslint:enable:no-any */ 
//# sourceMappingURL=task-ga-set.js.map