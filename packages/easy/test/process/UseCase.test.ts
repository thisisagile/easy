import { App, Scope, UseCase } from '../../src';

describe('UseCase', () => {
  test('id works', () => {
    expect(UseCase.ChangePassword.id).toBe('change-password');
  });

  test('id overload works', () => {
    const idUC = new UseCase(App.Main, 'test', 'own-id');
    expect(idUC.id).toBe('own-id');
  });

  test('scopes work', () => {
    expect(UseCase.ChangePassword.scopes).toContain(Scope.Auth);
  });

  test('scope works', () => {
    expect(UseCase.ChangePassword.app.id).toBe('main');
  });

  test('with works', () => {
    const withScope = UseCase.Main.with(Scope.Admin);
    expect(withScope.scopes).toHaveLength(1);
    expect(withScope.scopes).toContain(Scope.Admin);

    const withSpread = new UseCase(App.Main, 'test', 'own-id').with(Scope.Admin, Scope.Basic);
    expect(withSpread.scopes).toHaveLength(2);
    expect(withSpread.scopes).toContain(Scope.Admin);
    expect(withSpread.scopes).toContain(Scope.Basic);

    const withChaining = new UseCase(App.Main, 'test', 'own-id').with(Scope.Admin).with(Scope.Auth);
    expect(withChaining.scopes).toHaveLength(2);
    expect(withChaining.scopes).toContain(Scope.Admin);
    expect(withChaining.scopes).toContain(Scope.Auth);
  });

  test('byScope works', () => {
    const admin = UseCase.byScopes(Scope.Admin);
    expect(admin).toHaveLength(1);
    expect(admin).toContain(UseCase.Main);

    const basic = UseCase.byScopes(Scope.Basic);
    expect(basic).toHaveLength(4);
    expect(basic).toContain(UseCase.Login);
    expect(basic).toContain(UseCase.Logout);
    expect(basic).toContain(UseCase.ChangePassword);
    expect(basic).toContain(UseCase.ForgotPassword);

    const adminOrAuth = UseCase.byScopes(Scope.Admin, Scope.Auth);
    expect(adminOrAuth).toHaveLength(5);
    expect(adminOrAuth).toContain(UseCase.Login);
    expect(adminOrAuth).toContain(UseCase.Logout);
    expect(adminOrAuth).toContain(UseCase.ChangePassword);
    expect(adminOrAuth).toContain(UseCase.ForgotPassword);
  });

  test('backwards compatible with scope', () => {
    const scope = new UseCase(Scope.Admin, 'test');
    expect(scope.scope).toBe(Scope.Admin);
  });
});

describe('UseCase inheritance', () => {
  class ExtScope extends Scope {
    static readonly TestScope = new Scope('Test');
  }

  class ExtUseCase extends UseCase {
    static readonly ExtUseCase = new UseCase(App.Main, 'test').with(ExtScope.TestScope);
    static readonly SemiExtUseCase = new UseCase(App.Main, 'test 2').with(Scope.Admin);
  }

  test('byScope works on subclasses', () => {
    const test = ExtUseCase.byScopes(ExtScope.TestScope);
    expect(test).toHaveLength(1);
    expect(test).toContain(ExtUseCase.ExtUseCase);
  });
});
