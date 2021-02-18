import { fits, mock } from '@thisisagile/easy-test';
import { NextFunction, Request, Response } from 'express';
import { error, HttpStatus, rest, results } from '../../src';

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

  test('undefined', () => {
    error(undefined, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error undefined', () => {
    error({ error: undefined }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error undefined with options', () => {
    error({ error: undefined, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error string', () => {
    error({ error: 'help' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 400, errorCount: 1 }) }));
  });

  test('error string with options', () => {
    error({ error: 'help', options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 418, errorCount: 1 }) }));
  });

  test('error Error', () => {
    error({ error: new Error('help') }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error Error with options', () => {
    error({ error: new Error('help'), options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 1 }) }));
  });

  test('error Does not exist', () => {
    error({ error: new Error('Does not exist') }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NotFound.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 404, errorCount: 1 }) }));
  });

  test('error Does not exist with options', () => {
    error({ error: new Error('Does not exist'), options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Conflict.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 409, errorCount: 1 }) }));
  });

  test('error with results', () => {
    error({ error: results('help', 'me', 'please') }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.BadRequest.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 400, errorCount: 3 }) }));
  });

  test('error with results and options', () => {
    error({ error: results('help', 'me'), options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ImATeapot.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 418, errorCount: 2 }) }));
  });

  const resp = { status: HttpStatus.ImATeapot, body: rest.toError(HttpStatus.ImATeapot, [{ message: 'help' }, { message: 'me' }]) };

  test('error with response', () => {
    error({ error: resp }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 2 }) }));
  });

  test('error with response and options', () => {
    error({ error: resp, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(res.json).toHaveBeenCalledWith(fits.with({ error: fits.with({ code: 500, errorCount: 2 }) }));
  });
});
