import passport from 'passport';
import { authError, checkLabCoat, checkScope, checkToken, checkUseCase, security } from '../../src';
import { Request, Response } from 'express';
import { ctx, DotEnvContext, EnvContext, Environment, HttpStatus } from '@thisisagile/easy';
import { mock } from '@thisisagile/easy-test';
import { DevScope, DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';

describe('SecurityHandler decorators', () => {
  const cb = jest.fn();

  beforeEach(() => {
    cb.mockReset();
    ctx.env = new DotEnvContext();
  });

  test.each([[undefined], [''], [Environment.Acc.id], [Environment.Prd.id]])(
    'checkLabCoat returns an AuthError on empty and environments other than dev',
    name => {
      ctx.env = mock.empty<EnvContext>({ name: name as string });
      const c = checkLabCoat();
      c({} as Request, {} as Response, cb);
      expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    }
  );

  test('checkLabCoat succeeds on dev', () => {
    ctx.env = mock.empty<EnvContext>({ name: Environment.Dev.id as string });
    const c = checkLabCoat();
    c({} as Request, {} as Response, cb);
    expect(cb).toHaveBeenCalledWith(undefined);
  });

  test('checkToken', () => {
    const authenticateSpy = jest.spyOn(passport, 'authenticate');
    checkToken();
    expect(authenticateSpy).toHaveBeenCalledWith('jwt', { session: false, failWithError: true });
  });

  test('checkScope', () => {
    const c = checkScope(DevScope.Dev);

    c({} as Request, {} as Response, cb);
    c({ user: {} } as unknown as Request, {} as Response, cb);
    c({ user: { scopes: [] } } as unknown as Request, {} as Response, cb);
    c({ user: { scopes: [DevScope.Dev.code] } } as unknown as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });

  test('checkUseCase', () => {
    const c = checkUseCase(DevUseCase.ReleaseCode);

    c({} as Request, {} as Response, cb);
    c({ user: {} } as unknown as Request, {} as Response, cb);
    c({ user: { usecases: [] } } as unknown as Request, {} as Response, cb);
    c({ user: { usecases: [DevUseCase.ReleaseCode.code] } } as unknown as Request, {} as Response, cb);

    expect(cb).toHaveBeenCalledWith(authError(HttpStatus.Forbidden));
    expect(cb).toHaveBeenLastCalledWith(undefined);
  });
});

describe('SecurityHandler middleware', () => {
  const key = 'secretKey';
  let useSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.TOKEN_PUBLIC_KEY = 'token';
    useSpy = jest.spyOn(passport, 'use');
  });

  const testSecretOrKeyProvider = (cb: (err: any, secretOrKey?: string | Buffer) => void) =>
    useSpy.mockImplementationOnce(((s: any) => {
      s._secretOrKeyProvider(null, null, cb);
    }) as any);

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

    testSecretOrKeyProvider((err: any, secretOrKey?: string | Buffer) => {
      expect(secretOrKey).toBe(key);
    });

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('security middleware with secretOrKeyProvider', () => {
    const keyProvider = mock.resolve(key);
    const jwtStrategyOptions = { secretOrKeyProvider: keyProvider };

    testSecretOrKeyProvider((err: any, secretOrKey?: string | Buffer) => {
      expect(secretOrKey).toBe(key);
    });

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('security middleware with failing secretOrKeyProvider', () => {
    const keyProvider = mock.reject('someError');
    const jwtStrategyOptions = { secretOrKeyProvider: keyProvider };

    testSecretOrKeyProvider((err: any, secretOrKey?: string | Buffer) => {
      expect(err).toBe('someError');
    });

    security({ jwtStrategyOptions });

    expect(useSpy).toHaveBeenCalled();
  });

  test('JWT strategy sets context', () => {
    const payload = { key: 'value' };
    const done = jest.fn();

    useSpy.mockImplementationOnce(((s: any) => {
      s._verify({ headers: { authorization: `Bearer ${key}` } }, payload, done);
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
    expect(ctx.request.jwt).toBe('');
    expect(useSpy).toHaveBeenCalled();
  });
});
