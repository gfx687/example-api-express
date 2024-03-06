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

process.on("SIGTERM", server.stop);
process.on("SIGINT", server.stop);
