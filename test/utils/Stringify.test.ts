import { stringify } from '../../src';
import { Dev } from '../ref';

describe('Stringify', () => {
  const empty = stringify();
  const wouter = stringify('Wouter');
  const kim = stringify('Kim van Wilgen');

  test('toKebab works', () => {
    expect(empty.toKebab()).toBe('');
    expect(stringify({}).toKebab()).toBe('');
    expect(stringify(Dev.Sander).toKebab()).toBe('sander');
    expect(wouter.toKebab()).toBe('wouter');
    expect(kim.toKebab()).toBe('kim-van-wilgen');
  });

  test('toCap works', () => {
    expect(empty.toCap()).toBe('');
    expect(stringify({}).toCap()).toBe('');
    expect(stringify(Dev.Sander).toCap()).toBe('Sander');
    expect(wouter.toCap()).toBe('Wouter');
    expect(kim.toCap()).toBe('Kim van Wilgen');
  });

  test('toTitle works', () => {
    expect(empty.toTitle()).toBe('');
    expect(stringify({}).toTitle()).toBe('');
    expect(stringify(Dev.Sander).toTitle()).toBe('Sander');
    expect(wouter.toTitle()).toBe('Wouter');
    expect(kim.toTitle()).toBe('Kim Van Wilgen');
  });
});
