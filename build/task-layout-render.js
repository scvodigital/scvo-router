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
const jsonLogic = require("json-logic-js");
const dot = require("dot-object");
const task_base_1 = require("./task-base");
/* tslint:disable:no-any */
class TaskLayoutRender extends task_base_1.TaskBase {
    constructor(jsonLogicOperations) {
        super();
        if (jsonLogicOperations) {
            const operations = Object.keys(jsonLogicOperations);
            operations.forEach((operationName) => {
                const operation = jsonLogicOperations[operationName];
                jsonLogic.add_operation(operationName, operation);
            });
        }
    }
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const layoutName = jsonLogic.apply(config.logic, routeMatch);
            if (!config.layouts.hasOwnProperty(layoutName)) {
                throw new Error('Layout with the name "' + layoutName + '" does not exist');
            }
            const layout = config.layouts[layoutName];
            const layoutPartOutputs = {};
            const partNames = Object.keys(layout.parts);
            for (let p = 0; p < partNames.length; ++p) {
                const partName = partNames[p];
                const partPathOrTemplate = layout.parts[partName];
                const partTemplate = this.getTemplate(partPathOrTemplate, routeMatch);
                const partOutput = yield renderer.render(partTemplate, routeMatch);
                layoutPartOutputs[partName] = partOutput;
            }
            const layoutTemplate = this.getTemplate(layout.layout, routeMatch);
            routeMatch.layoutParts = layoutPartOutputs;
            const layoutOutput = yield renderer.render(layoutTemplate, routeMatch);
            delete routeMatch.layoutParts;
            if (config.output === 'data') {
                routeMatch.data[routeTaskConfig.name] = layoutOutput;
            }
            else if (config.output === 'body') {
                routeMatch.response.body = layoutOutput;
            }
            else {
                throw new Error('No output specified');
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    getTemplate(pathOrTemplate, routeMatch) {
        if (pathOrTemplate.indexOf('>') === 0 &&
            pathOrTemplate.indexOf('\n') === -1) {
            const path = pathOrTemplate.substr(1);
            const template = dot.pick(path, routeMatch);
            return template;
        }
        else {
            return pathOrTemplate;
        }
    }
}
exports.TaskLayoutRender = TaskLayoutRender;
/* tslint:enable:no-any */
//# sourceMappingURL=task-layout-render.js.map