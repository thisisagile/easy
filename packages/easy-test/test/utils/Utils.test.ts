import { asJson, asNumber, toArray } from '../../src/utils/Utils';

class Dev {
  constructor(readonly name: string) {}
}

describe('asJson', () => {
  test('asJson', () => {
    expect(asJson()).toBeUndefined();
    expect(asJson('')).toBeUndefined();
    expect(asJson(3)).toBeUndefined();
    expect(asJson({})).toMatchObject({});
    expect(asJson({ id: 3 })).toMatchObject({ id: 3 });
    expect(asJson(new Dev('Wouter'))).toMatchObject({ name: 'Wouter' });
  });

  test('asNumber', () => {
    expect(asNumber(undefined)).toBeNaN();
    expect(asNumber(undefined, 3)).toBe(3);
    expect(asNumber(undefined, () => 3)).toBe(3);
    expect(asNumber('')).toBeNaN();
    expect(asNumber('', 3)).toBe(3);
    expect(asNumber({})).toBeNaN();
    expect(asNumber({}, 3)).toBe(3);
    expect(asNumber({}, () => 3)).toBe(3);
    expect(asNumber({name: 'Sa'})).toBeNaN();
    expect(asNumber({name: 'Sa'}, 3)).toBe(3);
    expect(asNumber(4)).toBe(4);
    expect(asNumber(4, 3)).toBe(4);
    expect(asNumber('4')).toBe(4);
    expect(asNumber('4', 3)).toBe(4);
    expect(asNumber('4', () => 3)).toBe(4);
  });

  describe("toArray", () => {

    const naoufal = new Dev('Naoufal');
    const jeroen = new Dev('Jeroen');
    const spread = [naoufal, jeroen];

    test("from nothing", () => {
      expect(toArray()).toHaveLength(0);
      expect(toArray(undefined)).toHaveLength(0);
      expect(toArray(null)).toHaveLength(0);
      expect(toArray(naoufal)).toHaveLength(1);
      expect(toArray(naoufal, jeroen)).toHaveLength(2);
      expect(toArray([naoufal, jeroen])).toHaveLength(2);
      expect(toArray(...spread)).toHaveLength(2);
    });
  });
});
