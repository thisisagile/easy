import { stringify } from '../../src';

describe('Stringify', () => {
  const empty = stringify();
  const wouter = stringify('Wouter');
  const kim = stringify('Kim van Wilgen');

  test('toKebab works', () => {
    expect(empty.toKebab()).toBe('');
    expect(stringify({}).toKebab()).toBe('');
    expect(wouter.toKebab()).toBe('wouter');
    expect(kim.toKebab()).toBe('kim-van-wilgen');
  });
});
