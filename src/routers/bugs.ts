import express from "express";
import { resolveWithDelay } from "../helpers";
import * as bugsDao from "../models/bugs-dao";
import { bugUpdateSchema, newBugSchema } from "../models/bugs-types";
import { problem404 } from "../problem-details";
import { z } from "zod";
import {
  validateRequestBody,
  withParsedRequest,
  withParsedRequestParams,
  withParsedRequestQuery,
  zodStringToBoolSchema,
  zodStringToNumberSchema,
} from "@gfx687/express-zod-middleware";
import { db } from "../models/database";

const router = express.Router();

// Test endpoint, takes 0.2-0.7s to complete
// 80% of the time returns data
// 10% - fails (500)
// 10% - 404
router.get(
  "",
  withParsedRequestQuery(
    z.object({
      alwaysFail: zodStringToBoolSchema.optional(),
      always404: zodStringToBoolSchema.optional(),
    })
  ),
  async (req, res, _next) => {
    const bugs = await resolveWithDelay(bugsDao.getAll, 200, 700);

    if (req.query.always404 || Math.floor(Math.random() * 10) == 9) {
      return res.sendProblem(
        problem404("whatever you were looking for was not found")
      );
    }

    if (req.query.alwaysFail || Math.floor(Math.random() * 10) == 8) {
      throw new Error("scripted error");
    }

    res.json(bugs);
  }
);

router.get(
  "/:id",
  withParsedRequestParams(
    z.object({
      id: zodStringToNumberSchema,
    })
  ),
  async (req, res) => {
    const bug = await resolveWithDelay(
      () =>
        db
          .selectFrom("bugs")
          .where("id", "=", req.params.id)
          .selectAll()
          .executeTakeFirst(),
      5000,
      7000
    );

    if (!bug) {
      res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
      return;
    }

    res.json(bug);
  }
);

router.post("", validateRequestBody(newBugSchema), async (req, res) => {
  const newBug = await bugsDao.create({ ...req.body, status: "New" });
  res.status(201).send(newBug);
});

router.put(
  "/:id",
  withParsedRequest({
    params: z.object({ id: zodStringToNumberSchema }),
    body: bugUpdateSchema,
  }),
  async (req, res) => {
    const bug = await bugsDao.update(req.params.id, {
      ...req.body,
      updatedAt: new Date(),
    });
    if (!bug) {
      res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
      return;
    }

    res.json(bug);
  }
);

router.delete(
  "/:id",
  withParsedRequestParams(z.object({ id: zodStringToNumberSchema })),
  async (req, res) => {
    const deleteResult = await bugsDao.deleteBug(Number(req.params.id));
    if (deleteResult.numDeletedRows == BigInt(0)) {
      res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
      return;
    }
    res.status(204).send();
  }
);

export default router;
