import { Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { ZodSchema } from "zod";

import { problemValidation } from "./problem-details";

export function validateRequestBody<TBody>(schema: ZodSchema<TBody>) {
  return function (
    req: Request<ParamsDictionary, any, TBody, Query>,
    res: Response,
    next: NextFunction
  ) {
    const parseResult = schema.safeParse(req.body);
    if (parseResult.success) {
      return next();
    }

    res.sendProblem(
      problemValidation(
        parseResult.error.errors.map((x) => ({
          detail: x.message,
          pointer: x.path[0].toString(),
        }))
      )
    );
  };
}
