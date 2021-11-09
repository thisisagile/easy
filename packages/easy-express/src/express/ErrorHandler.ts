import express from 'express';
import { isAuthError } from './AuthError';
import {
  asString,
  choose,
  ctx,
  Exception,
  HttpStatus,
  isError,
  isException,
  isResponse,
  isResults,
  isText,
  OriginatedError,
  Response,
  rest,
  Result,
  Results,
  toHttpStatus,
  toOriginatedError,
  toResult,
  tryTo,
} from '@thisisagile/easy';

const toResponse = (status: HttpStatus, errors: Result[] = []): Response => ({
  status,
  body: rest.toError(status, errors),
});

const toBody = ({ origin, options }: OriginatedError): Response => {
  return choose<Response, any>(origin)
    .case(
      o => isAuthError(o),
      o => toResponse(toHttpStatus(o.status), [toResult(o.message)]),
    )
    .case(
      o => Exception.DoesNotExist.equals(o),
      (o: Exception) => toResponse(options?.onNotFound ?? HttpStatus.NotFound, [toResult(o.reason ?? o.message)]),
    )
    .case(
      // This service breaks with an error
      o => isError(o),
      (o: Error) => toResponse(HttpStatus.InternalServerError, [toResult(o.message)]),
    )
    .case(
      // This service fails
      o => isResults(o),
      (o: Results) => toResponse(options?.onError ?? HttpStatus.BadRequest, o.results),
    )
    .case(
      // Underlying service fails
      o => isResponse(o),
      (o: Response) => toResponse(HttpStatus.InternalServerError, o.body.error?.errors),
    )
    .case(
      o => isException(o),
      (o: Exception) => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(o.reason ?? o.message)]),
    )
    .case(
      // This service fails with a string
      o => isText(o),
      (o: Response) => toResponse(options?.onError ?? HttpStatus.BadRequest, [toResult(asString(o))]),
    )
    .else(() => toResponse(HttpStatus.InternalServerError, [toResult('Unknown error')]));
};

export const error = (e: Error, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  tryTo(() => toOriginatedError(e))
    .map(oe => toBody(oe))
    .accept(r => ctx.request.lastError = r.status.isServerError ? r.body.error?.errors[0]?.message : undefined)
    .accept(r => res.status(r.status.status).json(r.body));
};
