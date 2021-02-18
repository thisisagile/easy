import { isA, isError, isResults, Results } from '../types';
import express from 'express';
import { HttpStatus, Response, toRestResult, VerbOptions } from '../services';
import { choose } from '../utils';

type CustomError = { error: string | Error | Results | Response; options: VerbOptions };
const isCustomError = (e?: unknown): e is CustomError => isA<CustomError>(e, 'error', 'options');

export const error = (error: CustomError | Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  const p = isCustomError(error) ? error : { error, options: {} };

  const status = choose<HttpStatus, any>(p.error)
    .case(e => isResults(e), p.options?.onError ?? HttpStatus.BadRequest)
    .case(
      e => isError(e) && e.name === 'AuthenticationError',
      e => HttpStatus.byId(e.status, HttpStatus.InternalServerError)
    )
    .case(e => isError(e) && e.message === 'Does not exist', p.options?.onNotFound ?? HttpStatus.NotFound)
    .else(HttpStatus.InternalServerError);

  res.status(status.status).json(toRestResult(p.error, status));
};
