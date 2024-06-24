import express from 'express';
import { isAuthError } from './AuthError';
import {
  asString,
  choose,
  ctx,
  HttpStatus,
  isDoesNotExist,
  isError,
  isException,
  isResponse,
  isResults,
  isText,
  Response,
  rest,
  Result,
  toHttpStatus,
  toResult,
  tryTo,
} from '@thisisagile/easy';
import { OriginatedError, toOriginatedError } from '@thisisagile/easy-service';

const toResponse = (status: HttpStatus, errors: Result[] = []): Response => ({
  status,
  body: rest.toError(status, errors),
});

const toBody = ({ origin, options }: OriginatedError): Response => {
  return (
    choose(origin)
      .type(isAuthError, ae => toResponse(toHttpStatus(ae.status), [toResult(ae.message)]))
      .type(isDoesNotExist, e => toResponse(options?.onNotFound ?? HttpStatus.NotFound, [toResult(e.reason ?? e.message)]))
      // This service breaks with an error
      .type(isError, e => toResponse(HttpStatus.InternalServerError, [toResult(e.message)]))
      // This service fails
      .type(isResults, r => toResponse(options?.onError ?? HttpStatus.BadRequest, r.results))
      // Underlying service fails
      .type(isResponse, r => toResponse(HttpStatus.InternalServerError, r.body.error?.errors))
      .type(isException, e => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(e.reason ?? e.message)]))
      // This service fails with a string
      .type(isText, t => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(asString(t))]))
      .else(() => toResponse(HttpStatus.InternalServerError, [toResult('Unknown error')]))
  );
};

export const error = (e: Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  let response: Response;
  tryTo(() => toOriginatedError(e))
    .map(oe => toBody(oe))
    .accept(r => (response = r))
    .accept(r => (ctx.request.lastError = r.status.isServerError ? r.body.error?.errors[0]?.message : undefined))
    .accept(r => (ctx.request.lastErrorStack = r.status.isServerError ? e.stack : undefined))
    .recover(() => response)
    .accept(r => res.status(r.status.status).json(r.body));
};
