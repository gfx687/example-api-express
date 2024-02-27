import prometheus from "prom-client";
import promBundle from "express-prom-bundle";

const register = prometheus.register;

prometheus.collectDefaultMetrics({ register });

export function getMetricsMiddleware() {
  return promBundle({
    includeMethod: true,
    includePath: true,
    includeUp: false,
  });
}
