import { isError, isResults, isString, Result, Results, toResult } from '../types';
import express from 'express';
import { HttpStatus, isResponse, Response, rest, VerbOptions } from '../services';
import { choose } from '../utils';

type CustomError = { error: string | Error | Results | Response; options?: VerbOptions };

// const isCustomError = (e?: unknown): e is CustomError => isA<CustomError>(e, 'error', 'options');

const toResponse = (status: HttpStatus, errors: Result[] = []): Response => ({
  status,
  body: rest.toError(status, errors),
});

const toBody = (error: string | Error | Results | Response, options: VerbOptions = {}): Response => {
  return choose<Response, any>(error)
    .case(
      o => isError(o) && o.name === 'AuthenticationError',
      o => toResponse(HttpStatus.Forbidden, [toResult(o.message)])
    )
    .case(
      o => isError(o) && o.message === 'Does not exist',
      o => toResponse(options?.onNotFound ?? HttpStatus.NotFound, [toResult(o.message)])
    )
    .case(
      // This service breaks with an error
      o => isError(o),
      o => toResponse(HttpStatus.InternalServerError, [toResult(o.message)])
    )
    .case(
      // This service fails
      o => isResults(o),
      (o: Results) => toResponse(options?.onError ?? HttpStatus.BadRequest, o.results)
    )
    .case(
      // Underlying service fails
      o => isResponse(o),
      (o: Response) => toResponse(HttpStatus.InternalServerError, o.body.error?.errors)
    )
    .case(
      // This service fails with a string
      o => isString(o),
      (o: Response) => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(o)])
    )
    .else(() => toResponse(HttpStatus.InternalServerError, [toResult('Unknown error')]));
};

export const error = (e: CustomError | Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  const { status, body } = toBody((e as any)?.error ?? e, (e as any)?.options);
  res.status(status.status).json(body);
};
