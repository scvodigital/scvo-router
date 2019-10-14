import {CacheManager} from '../cache-manager';
import {Cookie, CookieOptions, RouteTaskConfiguration} from '../configuration-interfaces';
import {RendererBase} from '../renderer-base';
import {RouteMatch} from '../route-match';
import {TaskBase, TaskResult, TaskResultCommand} from '../task-base';

/* tslint:disable:no-any */
export class TaskCacheFlush extends TaskBase {
  constructor() {
    super();
  }

  async execute(
      routeMatch: RouteMatch,
      routeTaskConfig: RouteTaskConfiguration<TaskCacheFlushConfiguration>,
      renderer?: RendererBase): Promise<TaskResult> {
    if (!renderer) {
      throw new Error('No renderer specified');
    }

    const config = routeTaskConfig.config;

    routeMatch.cacheManager.flush(config.partition, routeMatch);

    routeMatch.setData('');
    routeMatch.log('Returning CONTINUE command');

    return {command: TaskResultCommand.CONTINUE};
  }
}

export interface TaskCacheFlushConfiguration {
  partition: string;
}
/* tslint:enable:no-any */