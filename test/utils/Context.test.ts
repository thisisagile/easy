import { ctx, isUuid, toUuid } from '../../src';

describe('Ctx', () => {
  test('env context', () => {
    process.env.HOST = 'www.easy.io';
    expect(ctx.env.host).toBe('www.easy.io');
    expect(ctx.env.port).toBe(8080);
    expect(ctx.env.domain).toBe('easy');
  });

  test('request context', () => {
    ctx.request.token = '42';
    ctx.request.correlationId = toUuid();
    expect(ctx.request.token).toBe('42');
    expect(isUuid(ctx.request.correlationId)).toBeTruthy();
  });

  test('other context', () => {
    ctx.other.id = 42;
    expect(ctx.other.id).toBe(42);
  });
});
