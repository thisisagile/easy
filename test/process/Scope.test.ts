import { Scope } from '../../src';

describe('Scope', () => {
  test('id works', () => {
    expect(Scope.Auth.id).toBe('authorization');
  });
});
