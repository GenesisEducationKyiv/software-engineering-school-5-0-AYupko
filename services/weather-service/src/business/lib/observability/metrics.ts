import promClient from "prom-client";

export const register = new promClient.Registry();

export const redisCacheHitsTotal = new promClient.Counter({
  name: "redis_cache_hits_total",
  help: "Total number of Redis cache hits",
  labelNames: ["cache_key"],
});

register.registerMetric(redisCacheHitsTotal);

export const httpRequestDurationSeconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 1.5, 2],
});

register.registerMetric(httpRequestDurationSeconds);

export const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestsTotal);

export const externalApiRequestDurationSeconds = new promClient.Histogram({
  name: "external_api_request_duration_seconds",
  help: "Duration of external API requests in seconds",
  labelNames: ["provider"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});

register.registerMetric(externalApiRequestDurationSeconds);

export const externalApiRequestsTotal = new promClient.Counter({
  name: "external_api_requests_total",
  help: "Total number of external API requests",
  labelNames: ["provider", "status_code"],
});

register.registerMetric(externalApiRequestsTotal);

export const incrementCacheHit = (cacheKey: string) => {
  redisCacheHitsTotal.inc({ cache_key: cacheKey });
};

export const observeHttpRequestDuration = (
  method: string,
  route: string,
  duration: number
) => {
  httpRequestDurationSeconds.observe({ method, route }, duration);
};

export const incrementHttpRequest = (
  method: string,
  route: string,
  statusCode: string
) => {
  httpRequestsTotal.inc({ method, route, status_code: statusCode });
};

export const observeExternalApiRequestDuration = (
  provider: string,
  duration: number
) => {
  externalApiRequestDurationSeconds.observe({ provider }, duration);
};

export const incrementExternalApiRequest = (
  provider: string,
  statusCode: string
) => {
  externalApiRequestsTotal.inc({ provider, status_code: statusCode });
};
