import { BaseContext, Context, ctx, DotEnvContext } from '../../src';
import { host, port } from '../../../../test/init';
import { Id } from '@thisisagile/easy-test/dist/utils/Types';

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

class TestRequestContext extends BaseContext {

  get shop(): Id {
    return this.get('shop');
  }

  set shop(t: Id) {
    this.set('shop', t);
  }

}

describe('Extending contexts', () => {

  const ctx = new Context<DotEnvContext, TestRequestContext>({ request: new TestRequestContext() });

  test('simple use of request context yo', () => {
    ctx.request.lastError = 'Error';
    expect(ctx.request.lastError).toBe('Error');
  });

  test('simple replace of request context yo', () => {
    ctx.request.lastError = 'Error';
    expect(ctx.request.lastError).toBe('Error');
    ctx.request.shop = 'NL';
    expect(ctx.request.shop).toBe('NL');
  });

  test('simple unchanged implementation of setting request context', () => {
    ctx.request = new TestRequestContext();
    ctx.request.lastError = 'Error';
    expect(ctx.request.lastError).toBe('Error');
    ctx.request.shop = 'NL';
    expect(ctx.request.shop).toBe('NL');
  });

});

describe('Extending contexts, part II', () => {

  const ctx = new Context<DotEnvContext, TestRequestContext>();

  test('simple use of request context 2', () => {
    ctx.request.lastError = 'Error2';
    expect(ctx.request.lastError).toBe('Error2');
  });

  test('simple replace of request context 2', () => {
    ctx.request.lastError = 'Error2';
    expect(ctx.request.lastError).toBe('Error2');
    ctx.request.shop = 'BE';
    expect(ctx.request.shop).toBe('BE');
  });

  test('simple unchanged implementation of setting request context', () => {
    ctx.request = new TestRequestContext();
    ctx.request.lastError = 'Error2';
    expect(ctx.request.lastError).toBe('Error2');
    ctx.request.shop = 'NL';
    expect(ctx.request.shop).toBe('NL');
  });
});

describe('Extending contexts, part IV', () => {

  const ctx = Context.use({ request: TestRequestContext });

  test('simple use of request context', () => {
    ctx.request.lastError = 'Error4';
    expect(ctx.request.lastError).toBe('Error4');
  });

  test('simple replace of request context', () => {
    ctx.request.lastError = 'Error4';
    expect(ctx.request.lastError).toBe('Error4');
    ctx.request.shop = 'BE';
    expect(ctx.request.shop).toBe('BE');
  });
});