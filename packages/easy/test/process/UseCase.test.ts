import { App } from '../../src/process/App';
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
    const basic = UseCase.Of({ app: App.Main, name: 'test' });
    const withId = UseCase.Of({ app: App.Main, name: 'test', id: 'own-id' });
    const withScopes = UseCase.Of({ app: App.Main, name: 'test', scopes: [Scope.Admin] });
    const withScopesAndID = UseCase.Of({ app: App.Main, name: 'test', id: 'own-id', scopes: [Scope.Admin] });
    expect(basic.id).toBe('test');
    expect(withId.id).toBe('own-id');
    expect(withScopes.id).toBe('test');
    expect(withScopes.scopes).toContain(Scope.Admin);
    expect(withScopesAndID.id).toBe('own-id');
    expect(withScopesAndID.scopes).toContain(Scope.Admin);
  });
});
