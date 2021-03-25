import { UseCase } from '../../src';

describe('UseCase', () => {
  test('id works', () => {
    expect(UseCase.ChangePassword.id).toBe('change-password');
  });

  test('scope works', () => {
    expect(UseCase.ChangePassword.scope.id).toBe('auth');
  });
});
