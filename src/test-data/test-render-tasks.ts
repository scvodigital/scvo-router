import {TaskRender, TaskRenderConfiguration} from '../basic-tasks/task-render';
import {TestRouteTask} from './test-router-configurations';

export const TEST_RENDER_TASK_TEMPLATE_EMBEDDED: TestRouteTask = {
  name: 'test_render_task',
  config: {
    template: '<html><head><title>TEST</title></head><body></body></html>',
    output: 'data'
  },
  renderer: 'handlebars',
  taskModule: 'taskRenderer',
  routerMetaData: {}
};

export const TEST_RENDER_TASK_TEMPLATE_REFERENCED: TestRouteTask = {
  name: 'test_render_task',
  config: {
    template: '>context.metaData.handlebars_templates.test_render_task',
    output: 'data'
  },
  renderer: 'handlebars',
  taskModule: 'taskRenderer',
  routerMetaData: {
    handlebars_templates: {
      test_render_task:
          '<html><head><title>TEST</title></head><body></body></html>'
    }
  }
};
