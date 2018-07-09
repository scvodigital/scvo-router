/* tslint:disable:no-any */
import * as querystring from 'querystring';
import * as url from 'url';
import DataTransform = require('node-json-transform');

import {RouteTaskConfiguration} from '../configuration-interfaces';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

export class TaskTransform extends TaskBase {
  parsers = {querystring: require('querystring'), url: require('url')};

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<any>): Promise<TaskResult> {
    let cache: string[] = [];
    let data = JSON.parse(JSON.stringify(routeMatch, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
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
    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskTransformConfiguration {
  map: any[]|any;
}
/* tslint:enable:no-any */
