import { Request, Response, NextFunction } from "express";
import pino from "pino";
import { ENV } from "./env";
import onFinished from "on-finished";

const logger = pino({
  formatters: {
    level: (label, _number) => ({ level: label }), // loglevel as a string instead of a number
    bindings: (bindings) => ({
      ...bindings,
      appname: "typescript-sandbox",
      version: ENV.APP_VERSION,
    }),
  },
});

declare global {
  namespace Express {
    interface Request {
      log: pino.Logger;
    }
  }
}

export function addLogger(req: Request, _res: Response, next: NextFunction) {
  req.log = logger.child({ traceId: req.id });

  next();
}

export function logHttp(req: Request, res: Response, next: NextFunction) {
  const startedAt = process.hrtime();

  onFinished(res, () => {
    const elapsed = process.hrtime(startedAt);
    const elapsedMs = (elapsed[0] * 1e3 + elapsed[1] * 1e-6).toFixed(2);
    req.log.info(
      {
        statusCode: res.statusCode,
        method: req.method,
        url: req.originalUrl,
      },
      `HTTP In-Response ${req.method} ${req.originalUrl} responded with ${res.statusCode} in ${elapsedMs} ms`
    );
  });

  next();
}

export default logger;
