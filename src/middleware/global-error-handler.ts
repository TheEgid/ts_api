import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers'
import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'

@Middleware({ type: 'after' })
export default class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: HttpError, request: Request, response: Response, next: () => NextFunction): void {
    // response.send({ error: Error });
    // next();
    response.status(error.status).json(error)
    next()
  }
}
