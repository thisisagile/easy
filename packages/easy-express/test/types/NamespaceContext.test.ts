import { NamespaceContext } from '../../src';

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
      jest.runOnlyPendingTimers();
      expect(context.get('test')).toBe(42);
    });
  });

  test('named setters and getters work', () => {
    context.create(() => {
      context.token = 'token';
      context.correlationId = 'correlation';
      context.lastError = 'error';
      context.tenant = '42';
      expect(context.token).toBe('token');
      expect(context.correlationId).toBe('correlation');
      expect(context.lastError).toBe('error');
      expect(context.tenant).toBe('42');
    });
  });
});
