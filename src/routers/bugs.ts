import express from "express";
import { resolveWithDelay, zodStringToBoolSchema } from "../helpers";
import * as bugsDao from "../models/bugs-dao";
import { bugUpdateSchema, newBugSchema } from "../models/bugs-types";
import { problem404 } from "../problem-details";
import { z } from "zod";
import {
  validateRequestBody,
  withParsedRequestQuery,
} from "@gfx687/express-zod-middleware";

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
  async (req, res, next) => {
    const bugs = await resolveWithDelay(bugsDao.getAll, 200, 700);

    if (req.query.always404 || Math.floor(Math.random() * 10) == 9) {
      return res.sendProblem(
        problem404("whatever you were looking for was not found")
      );
    }

    if (req.query.alwaysFail || Math.floor(Math.random() * 10) == 8) {
      return next(new Error("scripted error"));
    }

    res.json(bugs);
  }
);

router.get("/:id", (req, res) => {
  const bug = bugsDao.get(Number(req.params.id));
  if (!bug) {
    res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
    return;
  }

  res.json(bug);
});

router.post("", validateRequestBody(newBugSchema), (req, res) => {
  const newBug = bugsDao.create(req.body);
  res.status(201).send(newBug);
});

router.put("/:id", validateRequestBody(bugUpdateSchema), (req, res) => {
  const bug = bugsDao.update(Number(req.params.id), req.body);
  if (!bug) {
    res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
    return;
  }

  res.json(bug);
});

router.delete("/:id", (req, res) => {
  const bug = bugsDao.get(Number(req.params.id));
  if (!bug) {
    res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
    return;
  }

  bugsDao.deleteBug(Number(req.params.id));
  res.status(204).send();
});

export default router;
