import { ctx, isUuid, NamespaceContext, toUuid } from '../../src';
import { host, port } from '../init';

describe('Ctx', () => {
  test('env context', () => {
    expect(ctx.env.host).toBe(host);
    expect(ctx.env.port).toBe(port);
    expect(ctx.env.domain).toBe('easy');
  });

  test('request context', () => {
    ctx.request.create(() => {
      ctx.request.token = '42';
      ctx.request.correlationId = toUuid();
      expect(ctx.request.token).toBe('42');
      expect(isUuid(ctx.request.correlationId)).toBeTruthy();
    });
  });

  test('other context', () => {
    ctx.other.id = 42;
    expect(ctx.other.id).toBe(42);
  });
});

describe('NamespaceRequestContext', () => {
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
