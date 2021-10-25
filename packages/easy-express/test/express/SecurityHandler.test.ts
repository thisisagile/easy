import passport from 'passport';
import { authError, checkScope, checkToken, checkUseCase, security } from '../../src';
import { Request, Response } from 'express';
import { ctx, HttpStatus, Scope, UseCase } from '@thisisagile/easy';
import { mock } from '@thisisagile/easy-test';

describe('SecurityHandler decorators', () => {
  const cb = jest.fn();

  beforeEach(() => {
    cb.mockReset();
  });

  test('checkToken', () => {
    const authenticateSpy = jest.spyOn(passport, 'authenticate');
    checkToken();
    expect(authenticateSpy).toHaveBeenCalledWith('jwt', { session: false, failWithError: true });
  })

  test('checkScope', () => {
    const c = checkScope(Scope.Basic);

    c({} as Request, {} as Response, cb);
    c({ user: {} } as unknown as Request, {} as Response, cb);
    c({ user: { scopes: [] } } as unknown as Request, {} as Response, cb);
    c({ user: { scopes: [Scope.Basic.code] } } as unknown as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });

  test('checkUseCase', () => {
    const c = checkUseCase(UseCase.Main);

    c({} as Request, {} as Response, cb);
    c({ user: {} } as unknown as Request, {} as Response, cb);
    c({ user: { usecases: [] } } as unknown as Request, {} as Response, cb);
    c({ user: { usecases: [UseCase.Main.code] } } as unknown as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });
});

describe('SecurityHandler middleware', () => {
  const key = "secretKey";
  let useSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.TOKEN_PUBLIC_KEY = 'token';
    useSpy = jest.spyOn(passport, 'use');
  });

  test('security middleware with default settings', () => {
    const initializeSpy = jest.spyOn(passport, 'initialize');

    useSpy.mockImplementationOnce(((s: any) => {
      expect(s.name).toBe('jwt');
      expect(s._passReqToCallback).toBeTruthy();
      expect(s._verifOpts).toStrictEqual({
        audience: undefined,
        issuer: undefined,
        algorithms: undefined,
        ignoreExpiration: false,
      });
    }) as any);

    security();

    expect(useSpy).toHaveBeenCalled();
    expect(initializeSpy).toHaveBeenCalled();
  });

  test('security middleware with custom options', () => {
    const jwtStrategyOptions = {
      audience: 'audience',
      issuer: 'issuer',
      algorithms: undefined,
    };

    useSpy.mockImplementationOnce(((s: any) => {
      expect(s._verifOpts).toStrictEqual({
        ...jwtStrategyOptions,
        ignoreExpiration: false,
      });
    }) as any);

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('security middleware with secretOrKey', () => {
    const jwtStrategyOptions = { secretOrKey: key };

    useSpy.mockImplementationOnce(((s: any) => {
      s._secretOrKeyProvider(null, null, (err: any, secretOrKey?: string | Buffer) => {
        expect(secretOrKey).toBe(key);
      });
    }) as any);

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('security middleware with secretOrKeyProvider', () => {
    const keyProvider = mock.resolve(key);
    const jwtStrategyOptions = { secretOrKeyProvider: keyProvider };

    useSpy.mockImplementationOnce(((s: any) => {
      s._secretOrKeyProvider(null, null, (err: any, secretOrKey?: string | Buffer) => {
        expect(secretOrKey).toBe(key);
      });
    }) as any);

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('security middleware with failing secretOrKeyProvider', () => {
    const keyProvider = mock.reject("someError");
    const jwtStrategyOptions = { secretOrKeyProvider: keyProvider };

    useSpy.mockImplementationOnce(((s: any) => {
      s._secretOrKeyProvider(null, null, (err: any, secretOrKey?: string | Buffer) => {
        expect(err).toBe("someError");
      });
    }) as any);

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('JWT strategy sets context', () => {
    const payload = { key: "value" };
    const done = jest.fn();

    useSpy.mockImplementationOnce(((s: any) => {
      s._verify({ headers: { authorization: `Bearer ${key}`} }, payload, done);
    }) as any);

    security();
    expect(ctx.request.token).toBe(payload);
    expect(ctx.request.jwt).toBe(key);
    expect(done).toHaveBeenCalledWith(null, payload);
    expect(useSpy).toHaveBeenCalled();
  });

  test('JWT strategy defaults jwt to empty string', () => {
    useSpy.mockImplementationOnce(((s: any) => {
      s._verify({ headers: {} }, {}, jest.fn());
    }) as any);

    security();
    expect(ctx.request.jwt).toBe("");
    expect(useSpy).toHaveBeenCalled();
  });
});
