import { App, Scope, UseCase } from '../../src';
import { DevScope, DevUseCase } from '../ref/DevUseCase';

describe('UseCase', () => {
  test('id works', () => {
    expect(DevUseCase.ReleaseCode.id).toBe('release-code');
  });

  test('id overload works', () => {
    const idUC = new UseCase(App.Main, 'test', 'own-id');
    expect(idUC.id).toBe('own-id');
  });

  test('scopes work', () => {
    expect(DevUseCase.ReleaseCode.scopes).toContain(DevScope.Dev);
  });

  test('scope works', () => {
    expect(DevUseCase.ReleaseCode.app.id).toBe('main');
  });

  test('with works', () => {
    const withScope = DevUseCase.ReleaseCode.with(DevScope.Manager);
    expect(withScope.scopes).toHaveLength(3);
    expect(withScope.scopes).toContain(DevScope.Manager);

    const withSpread = new UseCase(App.Main, 'test', 'own-id').with(DevScope.Manager, DevScope.Tester);
    expect(withSpread.scopes).toHaveLength(2);
    expect(withSpread.scopes).toContain(DevScope.Manager);
    expect(withSpread.scopes).toContain(DevScope.Tester);

    const withChaining = new UseCase(App.Main, 'test', 'own-id').with(DevScope.Manager).with(DevScope.Tester);
    expect(withChaining.scopes).toHaveLength(2);
    expect(withChaining.scopes).toContain(DevScope.Manager);
    expect(withChaining.scopes).toContain(DevScope.Tester);
  });

  test('byScope works', () => {
    const admin = DevUseCase.byScopes(DevScope.Manager);
    expect(admin).toHaveLength(2);
    expect(admin).toContain(DevUseCase.ReleaseCode);
    expect(admin).toContain(DevUseCase.CreateSpreadSheet);

    const basic = DevUseCase.byScopes(DevScope.Dev);
    expect(basic).toHaveLength(5);
    expect(basic).toContain(DevUseCase.BuildCode);
    expect(basic).toContain(DevUseCase.WriteCode);
    expect(basic).toContain(DevUseCase.ReleaseCode);

    const adminOrAuth = DevUseCase.byScopes(DevScope.Tester, DevScope.Manager);
    expect(adminOrAuth).toHaveLength(4);
    expect(adminOrAuth).not.toContain(DevUseCase.WriteCode);
    expect(adminOrAuth).toContain(DevUseCase.ReleaseCode);
    expect(adminOrAuth).toContain(DevUseCase.BuildCode);
    expect(adminOrAuth).toContain(DevUseCase.CreateSpreadSheet);
  });

  test('byScope with unknown Scope returns empty list of use cases', () => {
    const s = { name: 'new', id: '' } as Scope;
    const uc = UseCase.byScopes(s);
    expect(uc).toHaveLength(0);
  });

  test('for works', () => {
    const marketing = 'Marketing';
    const uc = DevUseCase.WriteCode.for(marketing);
    expect(uc.name).toBe('Write Code Marketing');
    expect(uc.id).toBe('write-code-marketing');
    expect(uc.scopes[0]).toMatchObject(DevScope.Dev.for(marketing));
  });

  test('for works with multiple scopes', () => {
    const marketing = 'Marketing';
    const uc = DevUseCase.WriteUnitTest.for(marketing);
    expect(uc.name).toBe('Write Unit Test Marketing');
    expect(uc.id).toBe('write-unit-test-marketing');
    expect(uc.scopes[0]).toMatchObject(DevScope.Dev.for(marketing));
    expect(uc.scopes[1]).toMatchObject(DevScope.Tester.for(marketing));
  });
});
