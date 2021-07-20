import { Request, Response } from 'express';
import { mock } from '@thisisagile/easy-test';
import { ctx, HttpHeader, isUuid } from '@thisisagile/easy';
import { correlation } from '../../src';

describe('CorrelationHandler', () => {
  test('Correlation already in request', () => {
    ctx.request.create(() => {
      const req = { header: mock.return('42') } as unknown as Request;
      const res = { setHeader: mock.return() } as unknown as Response;
      const next = mock.return();
      correlation(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(HttpHeader.Correlation, '42');
      expect(ctx.request.correlationId).toBe('42');
    });
  });

  test('Correlation not already in request', () => {
    ctx.request.create(() => {
      const req = { header: mock.return() } as unknown as Request;
      const res = { setHeader: mock.return() } as unknown as Response;
      const next = mock.return();
      correlation(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith(HttpHeader.Correlation, ctx.request.correlationId);
      expect(isUuid(ctx.request.correlationId)).toBeTruthy();
    });
  });
});
