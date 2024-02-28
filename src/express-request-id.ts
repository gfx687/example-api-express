import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

type Options = {
  setHeader?: boolean | undefined;
  headerName?: string | undefined;
  generator?: ((request: Request) => string) | undefined;
};

export default function requestID({
  generator = (_) => randomUUID(),
  headerName = "X-Request-Id",
  setHeader = true,
}: Options = {}) {
  return function (request: Request, response: Response, next: NextFunction) {
    const oldValue = request.get(headerName);
    const id = oldValue === undefined ? generator(request) : oldValue;

    if (setHeader) {
      response.set(headerName, id);
    }

    request.id = id;

    next();
  };
}
