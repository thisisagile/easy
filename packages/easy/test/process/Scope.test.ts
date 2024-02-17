import { Scope } from '../../src';
import { DevScope } from '../ref/DevUseCase';

describe('Scope', () => {
  test('id works', () => {
    expect(DevScope.Manager.name).toBe('Manager');
    expect(DevScope.Manager.id).toBe('mngr');
    expect(DevScope.Manager.code).toBe('mngr');
  });

  test('for with a string', () => {
    const marketing = 'marketing';
    expect(DevScope.Manager.for(marketing)).toBeInstanceOf(Scope);
    expect(DevScope.Manager.for(marketing).name).toBe('Manager Marketing');
    expect(DevScope.Manager.for(marketing).id).toBe('mngr-marketing');
  });

  test('for with an IdName', () => {
    const marketing = { id: 'marketing', name: 'Marketing' };
    expect(DevScope.Manager.for(marketing)).toBeInstanceOf(Scope);
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
