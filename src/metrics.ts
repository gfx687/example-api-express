import prometheus from "prom-client";
import promBundle from "express-prom-bundle";

const register = prometheus.register;

prometheus.collectDefaultMetrics({ register });

export const httpMetricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeUp: true,
});

export const exceptionsCounter = new prometheus.Counter({
  name: "unhandled_exception_count",
  help: "count of exceptions that were handled by global exception handler",
});
