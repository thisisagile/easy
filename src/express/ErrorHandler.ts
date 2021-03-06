import {Exception, isError, isResults, isText, Result, Results, toResult, toString} from '../types';
import express from 'express';
import {HttpStatus, isResponse, OriginatedError, Response, rest, toOriginatedError} from '../http';
import {choose} from '../utils';
import {isAuthError} from './AuthError';

// // type CustomError = { error: ErrorOrigin; options?: VerbOptions };
//
// const toCustomError = (e?: unknown): OriginatedError => isOriginatedError(e) ? e : new OriginatedError(e);

const toResponse = (status: HttpStatus, errors: Result[] = []): Response => ({
  status,
  body: rest.toError(status, errors),
});

const toBody = ({origin, options}: OriginatedError): Response => {
  return choose<Response, any>(origin)
    .case(
      o => isAuthError(o),
      o => toResponse(HttpStatus.Forbidden, [toResult(o.message)])
    )
    .case(
      o => Exception.DoesNotExist.equals(o),
      (o: Exception) => toResponse(options?.onNotFound ?? HttpStatus.NotFound, [toResult(o.info ?? o.message)])
    )
    .case(
      // This service breaks with an error
      o => isError(o),
      (o: Error) => toResponse(HttpStatus.InternalServerError, [toResult(o.message)])
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
      o => isText(o),
      (o: Response) => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(toString(o))])
    )
    .else(() => toResponse(HttpStatus.InternalServerError, [toResult('Unknown error')]));
};

export const error = (e: Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  const {status, body} = toBody(toOriginatedError(e));
  res.status(status.status).json(body);
};
