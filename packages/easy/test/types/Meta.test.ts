import 'reflect-metadata';
import { Dev } from '../ref';
import { Constraint, List, meta } from '../../src';
import { fits } from '@thisisagile/easy-test';

describe('Meta', () => {
  let dev: Dev;

  beforeEach(() => {
    dev = new Dev({ name: 'Jeroen', language: 'TypeScript' });
  });

  test('Class decorator works', () => {
    const m = meta(dev);
    expect(m.set('salary', 5000)).toBe(5000);
    expect(m.get('salary')).toBe(5000);
  });

  test('Property decorator works', () => {
    const pm = meta(dev).property('name');
    expect(pm.set('valid', true)).toBeTruthy();
    const pm2 = meta(dev).property('name');
    expect(pm2.get('valid')).toBeTruthy();
  });

  test('Keys works', () => {
    const keys = meta(dev).keys('constraint');
    expect(keys).toHaveLength(7);
    expect(typeof keys).toBe(typeof new List<Constraint>());
    matchProperties(keys);
  });

  test('Values works', () => {
    const values = meta(dev).values();
    expect(values).toHaveLength(12);
  });

  test('Properties works', () => {
    const ps = meta(dev).properties('constraint');
    expect(ps).toHaveLength(6);
    matchProperties(ps);
  });

  const matchProperties = (constraints: List<any>): void => {
    expect(constraints).toContainEqual(fits.with({ property: 'id' }));
    expect(constraints).toContainEqual(fits.with({ property: 'name' }));
    expect(constraints).toContainEqual(fits.with({ property: 'language' }));
    expect(constraints).toContainEqual(fits.with({ property: 'level' }));
    expect(constraints).toContainEqual(fits.with({ property: 'created' }));
    expect(constraints).toContainEqual(fits.with({ property: 'lastModified' }));
    expect(constraints).toContainEqual(fits.with({ property: 'level' }));
  };
});
