import { asNumber } from '../../src';

describe('asNumber', () => {
  class Thing {
    constructor(private some: string) {}

    toString() {
      return this.some;
    }
  }

  test('works', () => {
    expect(asNumber(0)).toBe(0);
    expect(asNumber('42')).toBe(42);
    expect(asNumber(new Thing('42'))).toBe(42);
  });

  test('doesnt work', () => {
    expect(asNumber('Hi')).toBeNaN();
    expect(asNumber('h42')).toBeNaN();
    expect(asNumber(new Thing('no'))).toBeNaN();
  });

  test('doesnt work, but recovers', () => {
    expect(asNumber('Hi', 3)).toBe(3);
    expect(asNumber('h42', () => 43)).toBe(43);
    expect(asNumber(new Thing('no'), () => 44)).toBe(44);
  });
});
