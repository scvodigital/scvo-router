import {createHash as CreateHash} from 'crypto';
import * as Redis from 'redis';
import {promisify as Promisify} from 'util';

import {RouteMatch} from './route-match';

import dot = require('dot-object');
import {TaskResult} from './task-base';

/* tslint:disable:no-any */
export class CacheManager {
  client = Redis.createClient(
      process.env.REDISPORT ? Number(process.env.REDISPORT) : 6379,
      process.env.REDISHOST || 'localhost');

  GET = Promisify(this.client.GET).bind(this.client);
  SETEX = Promisify(this.client.SETEX).bind(this.client);
  KEYS = Promisify(this.client.KEYS).bind(this.client);

  constructor() {}

  async makeKey(config: CacheConfig, context: RouteMatch): Promise<CacheKey> {
    let data = '';
    for (const path of config.keyProperties) {
      const part = dot.pick(path, context);
      data += JSON.stringify(part);
    }
    const hash = CreateHash('sha1').update(data).digest('hex');
    return {partition: config.partition, key: hash};
  }

  async getItem(cacheKey: CacheKey, context: RouteMatch):
      Promise<TaskResult|null> {
    context.log(
        `CACHE MANAGER: Getting item '${cacheKey.partition}:${cacheKey.key}'`);

    const key = cacheKey.partition + ':' + cacheKey.key;
    const value: string|null = await this.GET(key);

    if (value === null) {
      context.log(`CACHE MANAGER: No item at '${cacheKey.partition}:${
          cacheKey.key}', returning null`);
      return null;
    }

    try {
      context.log(`CACHE MANAGER: Parsing item '${cacheKey.partition}:${
          cacheKey.key}'`);
      const output = JSON.parse(value) as TaskResult;
      context.log(
          `CACHE MANAGER: GOT item '${cacheKey.partition}:${cacheKey.key}'`);
      return output;
    } catch (err) {
      console.error(`CACHE MANAGER: Failed to parse cached value`, err);
      return null;
    }
  }

  async setItem(
      cacheKey: CacheKey, item: TaskResult, ttl: number,
      context: RouteMatch): Promise<void> {
    context.log(
        `CACHE MANAGER: Setting item '${cacheKey.partition}:${cacheKey.key}'`);

    const key = cacheKey.partition + ':' + cacheKey.key;
    const value = JSON.stringify(item);
    await this.SETEX(key, ttl, value);

    context.log(
        `CACHE MANAGER: Set item '${cacheKey.partition}:${cacheKey.key}'`);
  }

  async flush(partition: string, context: RouteMatch): Promise<void> {
    context.log(`CACHE MANAGER: Flushing partition '${partition}'`);

    const keys = await this.KEYS(partition + ':*');
    await this.DEL(keys);
  }

  DEL(keys: string[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client.DEL(keys, (err, total) => {
        if (err) {
          reject(err);
        } else {
          resolve(total);
        }
      });
    });
  }
}

export interface CacheConfig {
  keyProperties: string[];
  partition: string;
  ttl: number;
}

export interface CacheKey {
  partition: string|number;
  key: string|number;
}
/* tslint:enable:no-any */