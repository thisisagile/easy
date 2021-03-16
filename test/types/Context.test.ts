import { Context, ctx, NamespaceContext } from '../../src';
import { host, port } from '../init';

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

  test('invalid env port results in default port', () => {
    delete process.env.PORT;
    const c = new Context();
    expect(c.env.port).toBe(8080);
  });

  test('undefined environment variable', () => {
    expect(ctx.env.get('')).toBe('');
    expect(ctx.env.get('doesNotExist')).toBe('');
  });

  test('defined environment variables', () => {
    process.env.VAR_EXISTS = 'value';
    expect(ctx.env.get('varExists')).toBe('value');
  });
});

describe('Other Context', () => {
  test('can store and retrieve from other context', () => {
    ctx.other.id = 42;
    expect(ctx.other.id).toBe(42);
  });
});

describe('NamespaceContext', () => {
  let context: NamespaceContext;

  beforeEach(() => {
    context = new NamespaceContext();
  });

  test('can store and retrieve from namespace', () => {
    context.create(() => {
      expect(context.get('test')).toBeUndefined();
      context.set('test', 42);
      expect(context.get('test')).toBe(42);
    });
  });

  test('can store and retrieve asynchronously from namespace', () => {
    jest.useFakeTimers();

    context.create(() => {
      expect(context.get('test')).toBeUndefined();
      setImmediate(() => context.set('test', 42));
      jest.runAllImmediates();
      expect(context.get('test')).toBe(42);
    });
  });

  test('named setters and getters work', () => {
    context.create(() => {
      context.token = 'token';
      context.correlationId = 'correlation';
      expect(context.token).toBe('token');
      expect(context.correlationId).toBe('correlation');
    });
  });
});
