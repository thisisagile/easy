import { App } from '../../src';
import { Scope, UseCase } from '../../src';

describe('UseCase', () => {
  test('id works', () => {
    expect(UseCase.ChangePassword.id).toBe('change-password');
  });

  test('scopes work', () => {
    expect(UseCase.ChangePassword.scopes).toContain(Scope.Auth);
  });

  test('scope works', () => {
    expect(UseCase.ChangePassword.scope.id).toBe('main');
  });

  test('of maps correctly', () => {
    const basic = new UseCase(App.Main, 'test');
    const withId = new UseCase(App.Main, 'test', 'own-id');
    const withScopes = new UseCase(App.Main, 'test').with(Scope.Admin);
    const withScopesAndID = new UseCase(App.Main, 'test', 'own-id').with(Scope.Admin);
    expect(basic.id).toBe('test');
    expect(withId.id).toBe('own-id');
    expect(withScopes.id).toBe('test');
    expect(withScopes.scopes).toContain(Scope.Admin);
    expect(withScopesAndID.id).toBe('own-id');
    expect(withScopesAndID.scopes).toContain(Scope.Admin);
  });

  test('backwards compatible with scope', () => {
    const scope = new UseCase(Scope.Admin, 'test');
    expect(scope.scope).toBe(Scope.Admin);
  });
});
