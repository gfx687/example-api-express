// @ts-ignore
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import bugsRouter from "./routers/bugs";
import {
  configureProblemDetails,
  problem404,
  problem500,
} from "./problem-details";
import logger, { addLogger, logHttp } from "./logger";
import { exceptionsCounter, httpMetricsMiddleware } from "./metrics";
import { ENV } from "./env";
import { requestID } from "@gfx687/express-request-id";
import stoppable from "stoppable";
import { migrateOrPanic } from "./migrator";
import { db } from "./models/database";
import { promisify } from "util";

(async () => {
  await migrateOrPanic();

  const app = express();

  app.use(express.json());
  app.use(requestID());
  app.use(addLogger);
  app.use(logHttp);

  configureProblemDetails(app);

  app.use(httpMetricsMiddleware);

  app.use("/api/bugs", bugsRouter);

  app.use((req, res) => {
    res.sendProblem(problem404(`Path or resource '${req.url}' not found.`));
  });

  app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (req.log) {
      req.log.error(err);
    } else {
      logger.error(err);
    }

    exceptionsCounter.inc();
    res.sendProblem(problem500);
  });

  const server = stoppable(
    app.listen(ENV.PORT, () => {
      logger.info(`Started. Listening on port ${ENV.PORT}`);
    }),
    10000
  );

  const cleanup = async () => {
    try {
      await promisify(server.stop).bind(server)();
      await db.destroy();
      process.exit(0);
    } catch (err) {
      logger.error(
        { err },
        "An error occurred while doing cleanup before server close"
      );
    }
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);
})();
