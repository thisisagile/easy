import { Scope } from '../../src';
import { DevScope } from '../ref/DevUseCase';

describe('Scope', () => {
  test('id works', () => {
    expect(DevScope.Manager.name).toBe('Manager');
    expect(DevScope.Manager.id).toBe('mngr');
    expect(DevScope.Manager.code).toBe('mngr');
  });
});
