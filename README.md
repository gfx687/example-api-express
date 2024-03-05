# example-api-express

Example HTTP API service using TypeScript + Express.js (does not serve frontend, only API)

Does not contain any functionality. Project exists as a reference when creating new Express API projects

## Table of Content

- [Running Locally](#running-locally)
- [Features](#features)
  - [Error Handling](#error-handling)
  - [Environment Variables Validation](#environment-variables-validation)
  - [User Input Validation](#user-input-validation)
  - [Logging](#logging)
  - [Metrics](#metrics)
  - [X-Request-ID Header Propagation](#x-request-id-header-propagation)
- [Caveats, Known Issues, and Limitations](#caveats-known-issues-and-limitations)
  - [Async Error Handling in Express](#async-error-handling-in-express)
  - [Swagger](#swagger)

## Running Locally

See [infrastructure/README.md](infrastructure/README.md)

## Features

### Error Handling

Project introduces:

1. `ProblemDetails` type for HTTP error body

   Read more about Problem Details format here - [RFC9457](https://datatracker.ietf.org/doc/html/rfc9457)

   Example of Problem Details:

   ```
   HTTP/1.1 404 Not Found
   Content-Type: application/problem+json; charset=utf-8

   {
     "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
     "title": "Not Found",
     "detail": "Bug with id='2' not found",
     "status": 404
   }
   ```

2. Middleware for catching unhandled errors and returning 500 problem detail
3. Middleware for handling requests to non-existent endpoints and returning 404 problem detail
4. Added `.sendProblem(problem: ProblemDetails)` function to `express.Response` object for easy error return

   Example of usage:

   ```typescript
   router.put("/:id", (req, res) => {
     const bug = bugsDao.update(Number(req.params.id), req.body);
     if (!bug) {
       res.sendProblem(problem404(`Bug with id='${req.params.id}' not found`));
       return;
     }
     res.json(bug);
   });
   ```

### Environment Variables Validation

Project's environment variables are validated on application start using [zod](https://github.com/colinhacks/zod).

Add new environment variables in `src/env.ts` file and use them anywhere with

```typescript
import { ENV } from "./env";

console.log(ENV.APP_VERSION);
```

### User Input Validation

Project uses [zod](https://github.com/colinhacks/zod) for user input validation. As well as [express-zod-middleware](https://www.npmjs.com/package/@gfx687/express-zod-middleware) to provide boilerplate functions for validation.

See example of using validation middlewares in the [express-zod-middleware's REAME](https://www.npmjs.com/package/@gfx687/express-zod-middleware#example).

### Logging

This project uses [pino](https://github.com/pinojs/pino) library for logging.

The **app does not push / save logs anywhere** and simply prints them to STDOUT. The idea is that logs should be collected and delivered to log engine by infrastructure, not application code.

Project adds `.log` variable to `express.Request` object for easy access to logger.

It is recommended to use `req.log` rather than importing logger directly because `req.log` contains request-specific metadata like `traceId` which makes it easy to find all the logs which belong to the same request.

Example of usage:

```typescript
router.get("", (req, res) => {
  const bugs = bugsDao.getAll();

  req.log.info(`Found and returning ${bugs.length} bugs.`);

  res.json(bugs);
});
```

### Metrics

This project exposes an endpoint (`/metrics`) with metric data in Prometheus format.

Metrics added:
1) node process metrics that are added by Prometheus client
2) `http_request_duration_seconds` - information about HTTP requests handled (count, duration, path, etc)
3) `unhandled_exceptions_total` - total number of exceptions that reached global exception handling middleware

### X-Request-ID Header Propagation

`X-Request-ID` header is read from incoming HTTP requests (or generated if not found) and added to the `express.Request.id` field.

Main use-case is including this ID in logs for easy search. This will be done automatically as long as you use `express.Request.log` logger (read more in [Logging](#logging) section).

## Caveats, Known Issues, and Limitations

### Async Error Handling in Express

:warning: Out of the box express does not handle async errors.

If an async function in your handler throws an error without the error being properly handled then entire Express app will panic.

For that reason a package [async-express-errors](https://www.npmjs.com/package/express-async-errors) was added. There is no special way to use it. It simply overrides some express internals and makes thrown errors be handled by next middleware.

Make sure that you have it imported in the `src/index.ts` file so it can register the patch:
```typescript
import "express-async-errors";
```

### Swagger

There doesn't seem to be an easy way of adding Swagger to Express project.

Some of the options tried:

- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)  
   Does not parse the code base at all, purely generates from JSDoc comments, which means TONS of manual configuration. And not a one-time investment either, you need to also manually keep it up-to-date AND not forget that you need to update it.
- [swagger-autogen](https://github.com/swagger-autogen/swagger-autogen)  
   Provides some level of codebase analysis for swagger.json generation, but most of things are still done via comments. Most notably - model types. Same problem with manually updating every time API changes.
- [tsoa](https://tsoa-community.github.io/docs/getting-started.html)  
   Better than two options above as tsoa automatically generates and updates types based on your code.

  Upsides:

  - tsoa automatically generates swagger.json based on your code

  Downsides:

  - Does not with with inferred types (like what zod produces)
  - writing request handles in tsoa format
    Meaning controller classes and decorators as well as use of special functions
  - requires codegen step to turn tsoa Controllers into express handlers
