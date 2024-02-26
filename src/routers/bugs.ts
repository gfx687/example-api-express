import express from "express";
import { validateRequestBody } from "../helpers";
import * as bugsDao from "../models/bugs-dao";
import { bugUpdateSchema, newBugSchema } from "../models/bugs-types";
import { problem404 } from "../problem-details";

const router = express.Router();

router.get("", (req, res) => {
  const bugs = bugsDao.getAll();
  req.log.info(`Found and returning ${bugs.length} bugs.`);
  res.json(bugs);
});

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
