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
const dot = require("dot-object");
const task_base_1 = require("../task-base");
class TaskRender extends task_base_1.TaskBase {
    /* tslint:disable:no-any */
    execute(routeMatch, routeTaskConfig, renderer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!renderer) {
                throw new Error('No renderer specified');
            }
            const config = routeTaskConfig.config;
            const template = routeMatch.getObject(config.template);
            routeMatch.log('Loaded  template:', template);
            let rendered;
            try {
                rendered = yield renderer.render(template, routeMatch);
            }
            catch (err) {
                console.error('Failed to render template', err);
                throw err;
            }
            routeMatch.log('Rendered template output:', rendered);
            if (config.parseJson) {
                try {
                    rendered = JSON.parse(rendered);
                }
                catch (err) {
                    console.error('Failed to parse JSON', err, rendered);
                    throw err;
                }
            }
            if (config.output === 'data') {
                routeMatch.data[routeTaskConfig.name] = rendered;
            }
            else if (config.output === 'body') {
                routeMatch.response.body = rendered;
            }
            else {
                throw new Error('No output specified');
            }
            if (routeMatch.route.debug) {
                routeMatch.log(rendered);
            }
            if (config.contentType) {
                routeMatch.response.contentType = config.contentType;
            }
            if (config.filename) {
                const filename = yield renderer.render(config.filename, routeMatch);
                routeMatch.response.headers['Content-Disposition'] =
                    'attachment; filename=' + filename;
            }
            return { command: task_base_1.TaskResultCommand.CONTINUE };
        });
    }
    /* tslint:enable:no-any */
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
exports.TaskRender = TaskRender;
//# sourceMappingURL=task-render.js.map