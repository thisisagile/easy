import { isError, isResults, Results } from '../types';
import express from 'express';
import { HttpStatus, Response, toRestResult, VerbOptions } from '../services';
import { choose } from '../utils';

export const error = (
  p: { error: string | Error | Results | Response; options: VerbOptions },
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  res.set('Connection', 'close');
  const status: HttpStatus = choose<HttpStatus>(p.error)
    .case(e => isResults(e), p.options.onError)
    .case(e => isError(e) && e.message === 'Does not exist', p.options.onNotFound)
    .else(HttpStatus.InternalServerError);
  res.status(status.status);
  res.json(toRestResult(p.error, status));
};
