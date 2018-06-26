import 'mocha';

import {expect} from 'chai';
import handlebars = require('handlebars');

import {RouterRequest, RouterResponse} from './configuration-interfaces';
import {Router} from './router';
import {RendererHandlebars} from './renderer-handlebars';
import {TaskRenderLayout} from './basic-tasks/task-render-layout';
import {TaskRequest} from './basic-tasks/task-request';

/* tslint:disable */
describe('Constructor', () => {
  it('should initialize a new Router instance', async () => {
    const taskModules = {
      layoutRender: new TaskRenderLayout(),
      request: new TaskRequest()
    };
    const renderers = {handlebars: new RendererHandlebars(handlebars)};
    //    const router = new Router(TestSite, taskModules, renderers);
    //    const response = await router.go(TestGetIndexRequest);

    //    console.log(response);
  });
});
/* tslint:enable */
