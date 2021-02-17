import { mock } from '@thisisagile/easy-test';
import { NextFunction, Request, Response } from 'express';
import { authenticationError, error, HttpStatus, results, toRestResult, toResult } from '../../src';
import * as restResult from '../../src/services/RestResult';

describe('ErrorHandler', () => {
  const options = { onOk: HttpStatus.Ok, onNotFound: HttpStatus.NotFound, onError: HttpStatus.BadRequest };
  let req: Request;
  let res: Response;
  const toRestResultMock = jest.spyOn(restResult, 'toRestResult');
  let next: NextFunction;

  beforeEach(() => {
    req = ({} as unknown) as Request;
    res = ({ set: mock.this(), status: mock.this(), json: mock.this() } as unknown) as Response;
    next = mock.return();
    toRestResultMock.mockReturnValue({});
  });

  afterEach(() => {
    toRestResultMock.mockClear();
  });

  test('handle Error Does not exist', () => {
    const e = new Error('Does not exist');
    error({ error: e, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(options.onNotFound.status);
    expect(toRestResultMock).toHaveBeenCalledWith(e, options.onNotFound);
  });

  test('handle AuthenticationError', () => {
    const e = authenticationError(HttpStatus.Forbidden);
    error({ error: e, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Forbidden.status);
    expect(toRestResultMock).toHaveBeenCalledWith(e, HttpStatus.Forbidden);
  });

  test('handle Error', () => {
    const e = new Error('');
    error({ error: e, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.InternalServerError.status);
    expect(toRestResultMock).toHaveBeenCalledWith(e, HttpStatus.InternalServerError);
  });

  test('handle Results', () => {
    const r = results(toResult('Bad parameters'));
    error({ error: r, options }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(options.onError.status);
    expect(toRestResultMock).toHaveBeenCalledWith(r, options.onError);
  });
});
