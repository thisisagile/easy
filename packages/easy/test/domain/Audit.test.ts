import '@thisisagile/easy-test';
import { Audit, ctx, DateTime } from '../../src';
import { mock } from '@thisisagile/easy-test';

describe('Audit', () => {
  const by = { id: '42', user: 'john.dear@dmark.com' };
  const when = '2021-05-03T10:31:24.000Z';

  test('construct', () => {
    const a = new Audit({ by, when });
    expect(a).toBeValid();
    expect(a.by.id).toBe(by.id);
    expect(a.by.user).toBe(by.user);
    expect(a.when.toString()).toBe(when);
  });

  test('construct from empty', () => {
    mock.property(DateTime, 'now', new DateTime(when));

    const a = new Audit();
    expect(a).toBeValid();
    expect(a.by.id).toBe(0);
    expect(a.by.user).toBe('easy');
    expect(a.when.toString()).toBe(when);
  });

  test('construct from empty object defaults to easy', () => {
    const a = new Audit({});
    expect(a).not.toBeValid();
  });

  test.each([
    [{ by: { id: '42' } }],
    [{ by: { user: 'email' } }],
    [{ by: {} }],
    [{ by: undefined }],
  ])('construct from invalid request identity by %j defaults to easy', (by) => {
    mock.property(ctx.request, 'identity', by as any);
    const a = new Audit();
    expect(a).toBeValid();
    expect(a.by.id).toBe(0);
    expect(a.by.user).toBe('easy');
  });

  test('construct from valid request identity', () => {
    mock.property(ctx.request, 'identity', { ...by } as any);

    const a = new Audit();
    expect(a).toBeValid();
    expect(a.by).toEqual(by);
    expect(a.when).toBeInstanceOf(DateTime);
  });
});
