import { NextFunction, Request, Response } from 'express';
import { mock } from '@thisisagile/easy-test';
import { ctx, requestContext } from '../../src';

describe('requestContext', () => {
  test('Correlation already in request', () => {
    const m = jest.spyOn(ctx.request, 'create');
    const next = mock.return();

    m.mockImplementationOnce((fn: NextFunction) => fn());
    requestContext({} as Request, {} as Response, next);

    expect(m).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
