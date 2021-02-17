import { isA, isError, isResults, Results } from '../types';
import express from 'express';
import { HttpStatus, Response, toRestResult, VerbOptions } from '../services';
import { choose } from '../utils';

type CustomError = { error: string | Error | Results | Response; options: VerbOptions };

export const error = (error: CustomError | Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  const p = isA<CustomError>(error, 'error', 'options') ? error : { error, options: {} };

  const status = choose<HttpStatus, any>(p.error)
    .case(e => isResults(e), p.options?.onError || HttpStatus.BadRequest)
    .case(
      e => isError(e) && e.name === 'AuthenticationError',
      e => HttpStatus.byId(e.status, HttpStatus.InternalServerError)
    )
    .case(e => isError(e) && e.message === 'Does not exist', p.options?.onNotFound || HttpStatus.NotFound)
    .else(HttpStatus.InternalServerError);

  res.status(status.status).json(toRestResult(p.error, status));
};
