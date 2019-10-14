import * as Redis from 'redis';
import { RouteMatch } from './route-match';
import { TaskResult } from './task-base';
export declare class CacheManager {
    client: Redis.RedisClient;
    GET: any;
    SETEX: any;
    KEYS: any;
    constructor();
    makeKey(config: CacheConfig, context: RouteMatch): Promise<CacheKey>;
    getItem(cacheKey: CacheKey, context: RouteMatch): Promise<TaskResult | null>;
    setItem(cacheKey: CacheKey, item: TaskResult, ttl: number, context: RouteMatch): Promise<void>;
    flush(partition: string, context: RouteMatch): Promise<void>;
    DEL(keys: string[]): Promise<number>;
}
export interface CacheConfig {
    keyProperties: string[];
    partition: string;
    ttl: number;
}
export interface CacheKey {
    partition: string | number;
    key: string | number;
}
