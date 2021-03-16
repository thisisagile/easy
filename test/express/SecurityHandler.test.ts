import passport from 'passport';
import { authError, checkScope, checkUseCase, ctx, HttpStatus, Scope, security, UseCase } from '../../src';
import { Request, Response } from 'express';

describe('Checks', () => {
  const cb = jest.fn();

  beforeEach(() => {
    cb.mockReset();
  });

  test('checkScope', () => {
    const c = checkScope(Scope.Basic);

    c({} as Request, {} as Response, cb);
    c(({ user: {} } as unknown) as Request, {} as Response, cb);
    c(({ user: { scopes: [] } } as unknown) as Request, {} as Response, cb);
    c(({ user: { scopes: [Scope.Basic.code] } } as unknown) as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });

  test('checkUseCase', () => {
    const c = checkUseCase(UseCase.Main);

    c({} as Request, {} as Response, cb);
    c(({ user: {} } as unknown) as Request, {} as Response, cb);
    c(({ user: { usecases: [] } } as unknown) as Request, {} as Response, cb);
    c(({ user: { usecases: [UseCase.Main.code] } } as unknown) as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });
});

describe('SecurityHandler', () => {
  beforeEach(() => {
    process.env.TOKEN_PUBLIC_KEY = 'token';
  });

  test('security middleware with default settings', () => {
    const useSpy = jest.spyOn(passport, 'use');
    const initializeSpy = jest.spyOn(passport, 'initialize');

    useSpy.mockImplementationOnce(((s: any) => {
      expect(s.name).toBe('jwt');
      expect(s._passReqToCallback).toBeTruthy();
      expect(s._verifOpts).toStrictEqual({
        audience: undefined,
        issuer: ctx.env.domain,
        algorithms: undefined,
        ignoreExpiration: false,
      });
    }) as any);

    security();

    expect(useSpy).toHaveBeenCalled();
    expect(initializeSpy).toHaveBeenCalled();
  });

  test('security middleware with custom settings', () => {
    const useSpy = jest.spyOn(passport, 'use');
    process.env.TOKEN_ISSUER = 'issuer';
    process.env.TOKEN_AUDIENCE = 'audience';

    useSpy.mockImplementationOnce(((s: any) => {
      expect(s._verifOpts).toStrictEqual({
        audience: 'audience',
        issuer: 'issuer',
        algorithms: undefined,
        ignoreExpiration: false,
      });
    }) as any);

    security();

    expect(useSpy).toHaveBeenCalled();
  });
});
