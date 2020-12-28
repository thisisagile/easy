import { stringify } from '../../src';
import { Dev } from '../ref';

describe('Stringify', () => {
  const empty = stringify();
  const wouter = stringify('Wouter');
  const kim = stringify('Kim van Wilgen');

  test('toCap works', () => {
    expect(empty.toCap()).toBe('');
    expect(stringify({}).toCap()).toBe('');
    expect(wouter.toCap()).toBe('Wouter');
    expect(stringify(Dev.Sander).toCap()).toBe('Sander');
    expect(kim.toCap()).toBe('Kim van Wilgen');
  });

  test('toTitle works', () => {
    expect(empty.toTitle()).toBe('');
    expect(stringify({}).toTitle()).toBe('');
    expect(wouter.toTitle()).toBe('Wouter');
    expect(stringify(Dev.Sander).toTitle()).toBe('Sander');
    expect(kim.toTitle()).toBe('Kim Van Wilgen');
  });

  test('toPascal works', () => {
    expect(empty.toPascal()).toBe('');
    expect(stringify({}).toPascal()).toBe('');
    expect(wouter.toPascal()).toBe('Wouter');
    expect(stringify(Dev.Sander).toPascal()).toBe('Sander');
    expect(kim.toPascal()).toBe('KimVanWilgen');
  });

  test('toCamel works', () => {
    expect(empty.toCamel()).toBe('');
    expect(stringify({}).toCamel()).toBe('');
    expect(wouter.toCamel()).toBe('wouter');
    expect(stringify(Dev.Sander).toCamel()).toBe('sander');
    expect(kim.toCamel()).toBe('kimVanWilgen');
  });

  test('toKebab works', () => {
    expect(empty.toKebab()).toBe('');
    expect(stringify({}).toKebab()).toBe('');
    expect(wouter.toKebab()).toBe('wouter');
    expect(stringify(Dev.Sander).toKebab()).toBe('sander');
    expect(kim.toKebab()).toBe('kim-van-wilgen');
  });
});
