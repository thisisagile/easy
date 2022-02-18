import { asNumber, asJson } from '../../src/utils/Utils';

class Dev {
  constructor(readonly name: string) {}
}

describe('asJson', () => {
  test('works', () => {
    expect(asJson()).toBeUndefined();
    expect(asJson('')).toBeUndefined();
    expect(asJson(3)).toBeUndefined();
    expect(asJson({})).toMatchObject({});
    expect(asJson({ id: 3 })).toMatchObject({ id: 3 });
    expect(asJson(new Dev('Wouter'))).toMatchObject({ name: 'Wouter' });
  });
});

describe('asNumber', () => {

  class Thing {
    constructor(private some: string) {}

    toString() { return this.some; };
  }

  test('works', () => {
    expect(asNumber(0)).toBe(0);
    expect(asNumber('42')).toBe(42);
    expect(asNumber(new Thing('42'))).toBe(42);
  })

  test('doesnt work', () => {
    expect(asNumber('Hi')).toBeNaN();
    expect(asNumber('h42')).toBeNaN();
    expect(asNumber(new Thing('no'))).toBeNaN();
  })

  test('doesnt work, but recovers', () => {
    expect(asNumber('Hi', 3)).toBe(3);
    expect(asNumber('h42', () => 43)).toBe(43);
    expect(asNumber(new Thing('no'), () => 44)).toBe(44);
  })
});