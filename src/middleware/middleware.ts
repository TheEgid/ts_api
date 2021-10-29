import httpContext from "express-http-context";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export function loggingBefore(
  request: Request,
  response: Response,
  next: (err?: HttpError) => NextFunction
): void {
  console.log("do something Before...");
  console.log("set traceId = 123");
  httpContext.set("traceId", 123);
  next();
}

export function loggingAfter(
  request: Request,
  response: Response,
  next: (err?: HttpError) => NextFunction
): void {
  console.log("do something After...");
  console.log(`tracedId = ${httpContext.get("traceId") as string}`);
  next();
}
