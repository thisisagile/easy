import { BaseRequestContext, Context, ctx } from '../../src';
import { host, port } from '../../../../test/init';

describe('Environment Context', () => {
  test('default environment context', () => {
    expect(ctx.env.host).toBe(host);
    expect(ctx.env.port).toBe(port);
    expect(ctx.env.domain).toBe('easy');
  });

  test('override default environment context', () => {
    process.env.DOMAIN = 'domain';
    process.env.PORT = '42';
    const c = new Context();
    expect(c.env.domain).toBe('domain');
    expect(c.env.port).toBe(42);
  });

  test('environment name from environment context', () => {
    process.env.ENVIRONMENT_NAME = 'prd';
    const c = new Context();
    expect(c.env.name).toBe('prd');
  });

  test('app name from environment context', () => {
    process.env.APP = 'movie';
    const c = new Context();
    expect(c.env.app).toBe('movie');
  });

  test('invalid env port results in default port', () => {
    delete process.env.PORT;
    const c = new Context();
    expect(c.env.port).toBe(8080);
  });

  test('undefined environment variable', () => {
    expect(ctx.env.get('')).toBeUndefined();
    expect(ctx.env.get('doesNotExist')).toBeUndefined();
  });

  test('simple get and set on request context', () => {
    ctx.request.lastError = 'Wrong';
    expect(ctx.request.lastError).toBe('Wrong');
  });

  test('token should be an any in the context', () => {
    const c = new Context({ request: new BaseRequestContext() });
    c.request.token = { tenant: 42 };
    expect(c.request.token.tenant).toBe(42);
  });

  test('defined environment variables', () => {
    process.env.VAR_EXISTS = 'value';
    expect(ctx.env.get('varExists')).toBe('value');
  });

  test('alt environment variables', () => {
    expect(ctx.env.get('doesNotExist', 'value')).toBe('value');
  });
});

describe('Other Context', () => {
  test('can store and retrieve from other context', () => {
    ctx.other.id = 42;
    expect(ctx.other.id).toBe(42);
  });
});
