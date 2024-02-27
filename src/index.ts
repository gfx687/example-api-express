import express, { Request, Response, NextFunction } from "express";
import bugsRouter from "./routers/bugs";
import {
  configureProblemDetails,
  problem404,
  problem500,
} from "./problem-details";
import logger, { addLogger, logHttp } from "./logger";
import { getMetricsMiddleware } from "./metrics";

const PORT = 3001;
const app = express();

app.use(addLogger);
app.use(logHttp);
app.use(express.json());

configureProblemDetails(app);

app.use(getMetricsMiddleware());

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

  res.sendProblem(problem500);
});

app.listen(PORT, () => {
  logger.info(`Started. Listening on port ${PORT}`);
});
