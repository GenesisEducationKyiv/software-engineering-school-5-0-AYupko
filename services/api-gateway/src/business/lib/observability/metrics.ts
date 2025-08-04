import promClient from "prom-client";

export const register = new promClient.Registry();

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

export const downstreamRequestDurationSeconds = new promClient.Histogram({
  name: "downstream_request_duration_seconds",
  help: "Duration of downstream requests in seconds",
  labelNames: ["service", "route"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(downstreamRequestDurationSeconds);

export const downstreamRequestsTotal = new promClient.Counter({
  name: "downstream_requests_total",
  help: "Total number of downstream requests",
  labelNames: ["service", "route", "status_code"],
});
register.registerMetric(downstreamRequestsTotal);