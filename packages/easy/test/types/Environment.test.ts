import Environment from '../../src/entries/Environment';
import '@thisisagile/easy-test';

describe('Environment', () => {
  test('default construction.', () => {
    expect(Environment.Dev.id).toBe('dev');
    expect(Environment.Acc.name).toBe('Acceptance');
    expect(Environment.Dev).toBeInstanceOf(Environment.Enum);
  });

  test('creates custom environments through the catalogue API', () => {
    const environment: Environment.Enum = Environment.create('Local', 'local');

    expect(environment).toBeInstanceOf(Environment.Enum);
    expect(environment.id).toBe('local');
  });

  test('queries the explicit catalogue', () => {
    expect(Environment.byId('tst')).toBe(Environment.Tst);
    expect(Environment.all()).toEqual([Environment.Dev, Environment.Tst, Environment.Acc, Environment.Prd]);
  });
});
