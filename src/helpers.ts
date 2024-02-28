import { RequestHandler } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import z from "zod";
import { problemValidation } from "./problem-details";

export const zodStringToBoolSchema = z
  .string()
  .toLowerCase()
  .transform((x) => x === "true" || x === "1");

export function validateRequestBody<TBody>(
  schema: z.ZodSchema<TBody>
): RequestHandler<ParamsDictionary, any, TBody, Query> {
  return (req, res, next) => {
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

export function validateRequestQuery<TQuery>(
  schema: z.ZodSchema<TQuery, any, Query>
): RequestHandler<ParamsDictionary, any, any, TQuery> {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.query);
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

export function resolveWithDelay<T>(
  dataFn: () => T,
  delayMsLow: number,
  delayMsHigh?: number
): Promise<T> {
  delayMsHigh = delayMsHigh ?? delayMsLow;
  const delayMs =
    Math.floor(Math.random() * (delayMsHigh - delayMsLow + 1)) + delayMsLow;

  return new Promise<T>((resolve, _reject) => {
    setTimeout(() => {
      resolve(dataFn());
    }, delayMs);
  });
}
