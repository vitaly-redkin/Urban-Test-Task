/**
 * Module to implement simple LRU cache.
 */
import LRU from 'lru-cache';

import '../common/env';

// Cache object
const cache = new LRU({
  max: parseInt(process.env.CACHE_MAX),
  maxAge: parseInt(process.env.CACHE_MAX_AGE),
  updateAgeOnGet: true,
});

/**
 * Sets object in the cache.
 *
 * @param key cache key to use
 * @param value value to set in the cache
 */
export function cacheSet<T>(key: string, value: T): void {
  cache.set(key, value);
}

/**
 * Gets object from the cache.
 *
 * @param key cache key to use
 * @return value from the cache or undefined if not found
 */
export function cacheGet<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

/**
 * Composes cache key from prefix and values.
 *
 * @param prefix prefix for the cache key
 * @param params parameters to add values to the key
 */
export function cacheComposeKey<T>(prefix: string, ...params: T[]): string {
  return `${prefix}\t${params
    .map((p) => JSON.stringify(p, null, 2))
    .join('\t')}`;
}
