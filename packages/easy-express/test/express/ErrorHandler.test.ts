import { fits, mock } from '@thisisagile/easy-test';
import { NextFunction, Request, Response } from 'express';
import { ctx, Exception, HttpStatus, rest, toResults } from '@thisisagile/easy';
import { authError, error } from '../../src';
import { toOriginatedError } from '@thisisagile/easy-service';

describe('ErrorHandler', () => {
  const options = { onOk: HttpStatus.Ok, onNotFound: HttpStatus.Conflict, onError: HttpStatus.ImATeapot };
  let req: Request;
  let res: Response;
  let next: NextFunction;
  const serverError = 'Server Error';

  const withError = (code: HttpStatus, errorCount = 1) =>
    fits.with({
      error: fits.with({
        code: code.status,
        errorCount,
        message: code.name,
      }),
    });
  const withErrorAndMessage = (code: HttpStatus, errorCount = 1, message?: string) =>
    fits.with({
      error: fits.with({
        code: code.status,
        errorCount,
        errors: fits.with([{ message, domain: 'easy' }]),
        message: code.name,
      }),
    });

  beforeEach(() => {
    req = {} as unknown as Request;
    res = { set: mock.this(), status: mock.this(), json: mock.this() } as unknown as Response;
    next = mock.return();
  });

  test('simple error', () => {
    error(new Error('This is wrong'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError));
  });

  test('error undefined', () => {
    error(toOriginatedError(undefined), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError));
  });

  test('error undefined with options', () => {
    error(toOriginatedError(undefined, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError));
  });

  test('error string', () => {
    error(toOriginatedError('help'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.BadRequest));
  });

  test('error string with options', () => {
    error(toOriginatedError('help', options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.ImATeapot));
  });

  test('error Error', () => {
    error(toOriginatedError(new Error('help')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError));
  });

  test('error Error with options', () => {
    error(toOriginatedError(new Error('help'), options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError));
  });

  test('error Does not exist', () => {
    error(toOriginatedError(Exception.DoesNotExist), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NotFound.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.NotFound, 1, Exception.DoesNotExist.message));
  });

  test('error Does not exist with info', () => {
    error(toOriginatedError(Exception.DoesNotExist.because('Bad parameter')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NotFound.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.NotFound, 1, 'Bad parameter'));
  });

  test('error Does not exist with options', () => {
    error(toOriginatedError(Exception.DoesNotExist, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Conflict.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.Conflict));
  });

  test('error other Exceptions', () => {
    error(toOriginatedError(Exception.Unknown), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.BadRequest, 1, Exception.Unknown.message));
  });

  test('error other Exceptions with info', () => {
    error(toOriginatedError(Exception.Unknown.because('Broken')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.BadRequest, 1, 'Broken'));
  });

  test('error other Exceptions with options', () => {
    error(toOriginatedError(Exception.Unknown, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.ImATeapot));
  });

  test('error with results', () => {
    error(toOriginatedError(toResults('help', 'me', 'please')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.BadRequest, 3));
  });

  test('error with results and options', () => {
    error(toOriginatedError(toResults('help', 'me'), options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.ImATeapot, 2));
  });

  const resp = {
    status: HttpStatus.ImATeapot,
    body: rest.toError(HttpStatus.ImATeapot, [{ message: 'help' }, { message: 'me' }]),
  };

  test('error with response', () => {
    error(toOriginatedError(resp), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError, 2));
  });

  test('error with response and options', () => {
    error(toOriginatedError(resp, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withError(HttpStatus.InternalServerError, 2));
  });

  test('error with AuthenticationError Forbidden', () => {
    error(authError(HttpStatus.Forbidden), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Forbidden.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.Forbidden, 1, 'Forbidden'));
  });

  test('error with AuthenticationError NotAuthorized', () => {
    error(authError(HttpStatus.NotAuthorized), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NotAuthorized.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.NotAuthorized, 1, 'Not authorized'));
  });

  test("Don't set lastError on client error", () => {
    error(toOriginatedError(toResults('Client', 'Error')), req, res, next);
    expect(ctx.request.lastError).toBeUndefined();
    expect(ctx.request.lastErrorStack).toBeUndefined();
  });

  test('Set lastError on server error', () => {
    const e = new Error(serverError);
    error(e, req, res, next);
    expect(ctx.request.lastError).toBe(serverError);
    expect(ctx.request.lastErrorStack).toBe(e.stack);
  });

  test('Recover from Errors thrown in error', () => {
    const r = ctx.request;
    ctx.request = undefined as any;
    error(new Error(serverError), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(withErrorAndMessage(HttpStatus.InternalServerError, 1, serverError));
    ctx.request = r;
  });
});
