import Scope from '../../src/entries/Scope';
import { DevScope } from '../ref/DevUseCase';

describe('Scope', () => {
  test('default namespace exposes the value class', () => {
    expect(Scope.Enum).toBeDefined();
  });

  test('id works', () => {
    expect(DevScope.Manager.name).toBe('Manager');
    expect(DevScope.Manager.id).toBe('mngr');
    expect(DevScope.Manager.code).toBe('mngr');
  });

  test('constructs a value with explicit combined scopes', () => {
    const child = Scope.create('Child');
    const parent = Scope.create('Parent', 'parent', [child]);

    expect(parent.expand()).toEqual([child, parent]);
  });

  test('for with a string', () => {
    const marketing = 'marketing';
    expect(DevScope.Manager.for(marketing)).toBeInstanceOf(Scope.Enum);
    expect(DevScope.Manager.for(marketing).name).toBe('Manager Marketing');
    expect(DevScope.Manager.for(marketing).id).toBe('mngr-marketing');
  });

  test('for with an IdName', () => {
    const marketing = { id: 'marketing', name: 'Marketing' };
    expect(DevScope.Manager.for(marketing)).toBeInstanceOf(Scope.Enum);
    expect(DevScope.Manager.for(marketing).name).toBe('Manager Marketing');
    expect(DevScope.Manager.for(marketing).id).toBe('mngr-marketing');
  });

  test('combines', () => {
    expect(DevScope.People.name).toBe('People');
    expect(DevScope.People.id).toBe('people');
    expect(DevScope.Managers.expand()).toHaveLength(4);
    expect(DevScope.People.expand()).toHaveLength(7);
  });
});
