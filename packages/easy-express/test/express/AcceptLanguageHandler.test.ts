import '@thisisagile/easy-test';
import { IncomingHttpHeaders } from 'http';
import { NextFunction, Request, request, Response } from 'express';
import { BaseContext, ctx } from '@thisisagile/easy';
import { mock } from '@thisisagile/easy-test';
import { languageSelector } from '../../src';


class Headers implements IncomingHttpHeaders {
  [key: string]: string | string[] | undefined;
}

describe('languageSelector', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    ctx.request = new BaseContext();
    req = request;
    req.headers = new Headers();

    res = mock.empty<Response>();
    next = mock.return();
  });

  test('language selector set correct language', () => {
    req.headers['accept-language'] = 'de';
    languageSelector(req, res, next);
    expect(ctx.request.get('language')).toBe('de');
  });
  test('language selector doest a fallback on dutch if languages arent present', () => {
    req.headers['accept-language'] = 'ru';
    languageSelector(req, res, next);
    expect(ctx.request.get('language')).toBe('nl');
  });

  test('language selector falls back on dutch if no languages are sent', () => {
    languageSelector(req, res, next);
    expect(ctx.request.get('language')).toBe('nl');
  });
});
