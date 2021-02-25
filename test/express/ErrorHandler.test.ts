import { fits, mock } from '@thisisagile/easy-test';
import { NextFunction, Request, Response } from 'express';
import { error, Exception, HttpStatus, rest, results, toOriginatedError } from '../../src';

describe('ErrorHandler', () => {
  const options = { onOk: HttpStatus.Ok, onNotFound: HttpStatus.Conflict, onError: HttpStatus.ImATeapot };
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = ({} as unknown) as Request;
    res = ({ set: mock.this(), status: mock.this(), json: mock.this() } as unknown) as Response;
    next = mock.return();
  });

  test('simple error', () => {
    error(new Error('This is wrong'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('undefined', () => {
    error(toOriginatedError(undefined), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error undefined', () => {
    error(toOriginatedError(undefined), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error undefined with options', () => {
    error(toOriginatedError(undefined, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error string', () => {
    error(toOriginatedError('help'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 400, errorCount: 1 }) }));
  });

  test('error string with options', () => {
    error(toOriginatedError('help', options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 418, errorCount: 1 }) }));
  });

  test('error Error', () => {
    error(toOriginatedError(new Error('help')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error Error with options', () => {
    error(toOriginatedError(new Error('help'), options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error Does not exist', () => {
    error(toOriginatedError(Exception.DoesNotExist), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NotFound.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({
      error: fits.with({
        code: 404,
        message: Exception.DoesNotExist.message,
        errorCount: 1,
      }),
    }));
  });

  test('error Does not exist with options', () => {
    error(toOriginatedError(Exception.DoesNotExist, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Conflict.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 409, errorCount: 1 }) }));
  });

  test('error with results', () => {
    error(toOriginatedError(results('help', 'me', 'please')), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 400, errorCount: 3 }) }));
  });

  test('error with results and options', () => {
    error(toOriginatedError(results('help', 'me'), options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 418, errorCount: 2 }) }));
  });

  const resp = {
    status: HttpStatus.ImATeapot,
    body: rest.toError(HttpStatus.ImATeapot, [{ message: 'help' }, { message: 'me' }]),
  };

  test('error with response', () => {
    error(toOriginatedError(resp), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 2 }) }));
  });

  test('error with response and options', () => {
    error(toOriginatedError(resp, options), req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 2 }) }));
  });
});
