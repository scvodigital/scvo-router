import deepExtend = require('deep-extend');

import {RouterConfiguration, RouteTaskConfiguration, RouterResponse, RouteConfiguration} from '../configuration-interfaces';

/* tslint:disable:no-any */
export class RouterConfigurationBuilder {
  defaults: RouterConfiguration =
      {name: 'Test Site', domains: ['test-site.com'], metaData: {}, routes: []};

  constructor(defaults: RouterConfigurationDefaults) {
    this.defaults.name = defaults.name || this.defaults.name;
    this.defaults.domains = defaults.domains || this.defaults.domains;
    this.defaults.metaData = defaults.metaData || this.defaults.metaData;
    this.defaults.disasterResponse = defaults.disasterResponse || undefined;
  }

  build(routes: TestRoute[]): RouterConfiguration {
    const routerConfiguration: RouterConfiguration = {
      name: this.defaults.name,
      domains: this.defaults.domains,
      metaData: {},
      routes: [],
    };
    Object.assign(routerConfiguration.metaData, this.defaults.metaData);
    if (this.defaults.disasterResponse) {
      routerConfiguration.disasterResponse = this.defaults.disasterResponse;
    }

    routes.forEach((route: TestRoute) => {
      route.tasks.forEach((task) => {
        deepExtend(routerConfiguration.metaData, task.routerMetaData);
        if (task.routerMetaData) {
          delete task.routerMetaData;
        }
      });
      routerConfiguration.routes.push(route);
    });

    return routerConfiguration;
  }
}

export interface RouterConfigurationDefaults {
  name?: string;
  domains?: string[];
  metaData?: any;
  disasterResponse?: RouterResponse;
}

export interface TestRoute extends RouteConfiguration {
  tasks: TestRouteTask[];
}

export interface TestRouteTask extends RouteTaskConfiguration<any> {
  routerMetaData?: any;
}
/* tslint:enable:no-any */
