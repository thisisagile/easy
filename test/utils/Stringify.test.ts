import { stringify } from '../../src';
import { Dev } from '../ref';

describe('Stringify', () => {
  const empty = stringify();
  const wouter = stringify('Wouter');
  const kim = stringify('Kim van Wilgen');

  test('toKebab works', () => {
    expect(empty.toKebab()).toBe('');
    expect(stringify({}).toKebab()).toBe('');
    expect(stringify(Dev.Sander).toKebab()).toBe('');
    expect(wouter.toKebab()).toBe('wouter');
    expect(kim.toKebab()).toBe('kim-van-wilgen');
  });

  test('toCap works', () => {
    expect(empty.toCap()).toBe('');
    expect(stringify({}).toCap()).toBe('');
    expect(stringify(Dev.Sander).toCap()).toBe('');
    expect(wouter.toKebab()).toBe('wouter');
    expect(kim.toKebab()).toBe('kim-van-wilgen');
  });
});
