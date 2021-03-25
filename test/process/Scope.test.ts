import { Scope } from '../../src';

describe('Scope', () => {
  test('id works', () => {
    expect(Scope.Auth.name).toBe('Authorization');
    expect(Scope.Auth.id).toBe('auth');
    expect(Scope.Auth.code).toBe('auth');
  });
});
