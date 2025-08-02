import promClient from 'prom-client';

export const register = new promClient.Registry();

export const redisCacheHitsTotal = new promClient.Counter({
  name: 'redis_cache_hits_total',
  help: 'Total number of Redis cache hits',
  labelNames: ['cache_key'],
});

register.registerMetric(redisCacheHitsTotal);

export const incrementCacheHit = (cacheKey: string) => {
  redisCacheHitsTotal.inc({ cache_key: cacheKey });
};