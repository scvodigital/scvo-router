"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_RENDER_TASK_TEMPLATE_EMBEDDED = {
    name: 'test_render_task',
    config: {
        template: '<html><head><title>TEST</title></head><body></body></html>',
        output: 'data'
    },
    renderer: 'handlebars',
    taskModule: 'taskRenderer',
    routerMetaData: {}
};
exports.TEST_RENDER_TASK_TEMPLATE_REFERENCED = {
    name: 'test_render_task',
    config: {
        template: '>context.metaData.handlebars_templates.test_render_task',
        output: 'data'
    },
    renderer: 'handlebars',
    taskModule: 'taskRenderer',
    routerMetaData: {
        handlebars_templates: {
            test_render_task: '<html><head><title>TEST</title></head><body></body></html>'
        }
    }
};
//# sourceMappingURL=test-render-tasks.js.map