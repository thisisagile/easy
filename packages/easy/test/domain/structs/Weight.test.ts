import '@thisisagile/easy-test';
import { UnitOfWeight, Weight, weight } from '../../../src';

describe('Weight', () => {
  test('Weight with value is not valid', () => {
    const dim = new Weight();
    expect(dim).not.toBeValid();
  });

  test('Weight with UOW', () => {
    const w: Weight = new Weight({
      value: 100,
      uow: UnitOfWeight.KG,
    });
    expect(w).toBeValid();
    expect(w.value).toBe(100);
    expect(w.uow).toBe(UnitOfWeight.KG);
  });

  test('Weight without UOW', () => {
    const w: Weight = new Weight({ value: 200 });
    expect(w).toBeValid();
    expect(w.value).toBe(200);
    expect(w.uow).toBe(UnitOfWeight.G);
  });

  test('SizeInG works', () => {
    const w: Weight = new Weight({ value: 200, uow: UnitOfWeight.KG });
    expect(w).toBeValid();
    expect(w.value).toBe(200);
    expect(w.uow).toBe(UnitOfWeight.KG);
  });

  test('gte & lte works', () => {
    const heavy: Weight = new Weight({ value: 200, uow: UnitOfWeight.KG });
    const light: Weight = new Weight({ value: 1, uow: UnitOfWeight.KG });
    expect(heavy.gte(light)).toBeTruthy();
    expect(light.gte(heavy)).toBeFalsy();
    expect(light.gte(light)).toBeTruthy();

    expect(heavy.lte(light)).toBeFalsy();
    expect(light.lte(heavy)).toBeTruthy();
    expect(light.lte(light)).toBeTruthy();
  });

  test.each([
    { w: weight(0), lower: weight(0), upper: undefined, exp: true },
    { w: weight(0), lower: weight(0), upper: weight(0), exp: true },
    { w: weight(0), lower: weight(0), upper: weight(1), exp: true },
    { w: weight(1), lower: weight(0), upper: weight(1), exp: true },
    { w: weight(1), lower: weight(0), upper: weight(2), exp: true },
    { w: weight(2), lower: weight(1), upper: weight(3), exp: true },
    { w: weight(10, UnitOfWeight.KG), lower: weight(0), upper: undefined, exp: true },
    { w: weight(0, UnitOfWeight.KG), lower: weight(0), upper: weight(0), exp: true },
    { w: weight(0, UnitOfWeight.KG), lower: weight(0), upper: weight(1), exp: true },
    { w: weight(1, UnitOfWeight.KG), lower: weight(0), upper: weight(1, UnitOfWeight.KG), exp: true },
    { w: weight(1, UnitOfWeight.KG), lower: weight(0), upper: weight(2, UnitOfWeight.KG), exp: true },
    { w: weight(2, UnitOfWeight.KG), lower: weight(1), upper: weight(3, UnitOfWeight.KG), exp: true },
    { w: weight(1), lower: weight(0), upper: weight(0), exp: false },
    { w: weight(2), lower: weight(0), upper: weight(1), exp: false },
    { w: weight(2), lower: weight(3), upper: weight(1), exp: false },
    { w: weight(2), lower: weight(3), upper: weight(4), exp: false },
    { w: weight(1, UnitOfWeight.G), lower: weight(0), upper: weight(0), exp: false },
    { w: weight(2, UnitOfWeight.MG), lower: weight(0, UnitOfWeight.MG), upper: weight(1, UnitOfWeight.MG), exp: false },
    { w: weight(2, UnitOfWeight.KG), lower: weight(3), upper: weight(1), exp: false },
    { w: weight(2, UnitOfWeight.G), lower: weight(3), upper: weight(4), exp: false },
  ])('between works %s', ({ w, lower, upper, exp }) => {
    expect(w.between(lower, upper)).toBe(exp);
  });

  test('sum works', () => {
    const heavy: Weight = new Weight({ value: 200, uow: UnitOfWeight.KG });
    const light: Weight = new Weight({ value: 1, uow: UnitOfWeight.G });
    expect(light.sum(heavy).value).toBe(200001);
    expect(light.sum(heavy).uow).toBe(UnitOfWeight.G);
    expect(heavy.sum(light).uow).toBe(UnitOfWeight.KG);
    expect(heavy.sum(light).value).toBe(200.001);
  });
});
