import express from "express";

declare global {
  namespace Express {
    interface Response {
      sendProblem: (problem: ProblemDetails) => void;
    }
  }
}

export function configureProblemDetails(app: express.Express) {
  app.response.sendProblem = function (problem: ProblemDetails) {
    this.status(problem.status);
    this.setHeader("content-type", "application/problem+json");
    this.json(problem);
  };
}

export type ProblemDetails = {
  type: string;
  title: string;
  detail: string;
  status: number;

  [x: string]: unknown;
};

export function problem404(detail: string): ProblemDetails {
  return {
    type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
    title: "Not Found",
    detail: detail,
    status: 404,
  };
}

export function problemValidation(
  errors: { detail: string; pointer: string }[]
): ProblemDetails {
  return {
    type: "https://datatracker.ietf.org/doc/html/rfc9110#name-422-unprocessable-content",
    title: "Your request is not valid.",
    detail: "Input is invalid, see 'errors' for more information.",
    status: 422,
    errors: errors,
  };
}

export const problem500: ProblemDetails = {
  type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  title: "Internal Server Error",
  detail: "An error occured while processing your request.",
  status: 500,
};
