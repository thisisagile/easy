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
      UOW: UnitOfWeight.KG
    });
    expect(w).toBeValid();
    // eslint-disable-next-line
    expect(w.value).toBe(100);
    expect(w.UOW).toBe(UnitOfWeight.KG);
  });

  test('Weight without UOW', () => {
    const w: Weight = new Weight({value: 200 });
    expect(w).toBeValid();
    // eslint-disable-next-line
    expect(w.value).toBe(200);
    expect(w.UOW).toBe(UnitOfWeight.G);
  });
});