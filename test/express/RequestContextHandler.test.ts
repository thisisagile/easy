import { NextFunction, Request, Response } from 'express';
import { mock } from '@thisisagile/easy-test';
import { ctx, requestContext } from '../../src';

describe('requestContext', () => {
  test('correlation already in request', () => {
    const m = jest.spyOn(ctx.request, 'create').mockImplementationOnce((fn: NextFunction) => fn());
    const next = mock.return();

    requestContext({} as Request, {} as Response, next);
    expect(m).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
