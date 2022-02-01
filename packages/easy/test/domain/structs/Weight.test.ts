import '@thisisagile/easy-test';
import { Weight, UnitOfWeight } from '../../../src';

describe('Weight', () => {

  test('Weight with value is not valid', () => {
    const dim = new Weight();
    expect(dim).not.toBeValid();
  });

  test('Weight with UOW', () => {
    const w: Weight = new Weight({
      value: 100,
      uow: UnitOfWeight.KG
    });
    expect(w).toBeValid();
    expect(w.value).toBe(100);
    expect(w.uow).toBe(UnitOfWeight.KG);
  });

  test('Weight without UOW', () => {
    const w: Weight = new Weight({value: 200 });
    expect(w).toBeValid();
    expect(w.value).toBe(200);
    expect(w.uow).toBe(UnitOfWeight.G);
  });

  test('SizeInG works', () => {
    const w: Weight = new Weight({value: 200, uow: UnitOfWeight.KG });
    expect(w).toBeValid();
    expect(w.value).toBe(200);
    expect(w.uow).toBe(UnitOfWeight.KG);
  });

  test('gte works', () => {
    const heavy: Weight = new Weight({value: 200, uow: UnitOfWeight.KG });
    const light: Weight = new Weight({value: 1, uow: UnitOfWeight.KG });
    expect(heavy.gte(light)).toBeTruthy()
    expect(light.gte(heavy)).toBeFalsy()
    expect(light.gte(light)).toBeTruthy()
  });


});