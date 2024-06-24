import { mock } from '@thisisagile/easy-test';
import { NextFunction, Request, Response } from 'express';
import { Exception } from '@thisisagile/easy';
import { notFound } from '../../src';
import { toOriginatedError } from '@thisisagile/easy-service';

describe('NotFoundHandler', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = mock.return();
  });

  test('Call next with DoesNotExist error', () => {
    notFound({} as Request, {} as Response, next);
    expect(next).toHaveBeenCalledWith(toOriginatedError(Exception.DoesNotExist));
  });
});
