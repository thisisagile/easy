import { Box, Dimension, UnitOfMeasurement } from '../../../src';

const b = (
  l: number,
  w: number,
  h: number,
  lUom: UnitOfMeasurement = UnitOfMeasurement.MM,
  wUom: UnitOfMeasurement = UnitOfMeasurement.MM,
  hUom: UnitOfMeasurement = UnitOfMeasurement.MM
): Box =>
  new Box({
    l: Dimension.with(l, lUom),
    w: Dimension.with(w, wUom),
    h: Dimension.with(h, hUom),
  });

describe('Box', () => {
  test('Box with out l, b, h is not valid', () => {
    const box = new Box();
    const box2 = new Box({ l: Dimension.with(10), w: Dimension.with(10) });
    const box3 = new Box({ h: Dimension.with(10), w: Dimension.with(10) });
    const box4 = new Box({ l: Dimension.with(10), h: Dimension.with(10) });
    expect(box.isValid).toBeFalsy();
    expect(box2.isValid).toBeFalsy();
    expect(box3.isValid).toBeFalsy();
    expect(box4.isValid).toBeFalsy();
  });

  test('Box works', () => {
    const box: Box = new Box({
      l: { value: 100, uom: UnitOfMeasurement.MM },
      w: { value: 200, uom: UnitOfMeasurement.CM },
      h: { value: 300, uom: UnitOfMeasurement.KM },
    });
    expect(box.isValid).toBeTruthy();
    expect(box.l.value).toBe(100);
    expect(box.w.value).toBe(200);
    expect(box.h.value).toBe(300);
    expect(box.l.uom).toBe(UnitOfMeasurement.MM);
    expect(box.w.uom).toBe(UnitOfMeasurement.CM);
    expect(box.h.uom).toBe(UnitOfMeasurement.KM);
  });

  test('Stack works', () => {
    const box = b(100, 10, 1).stack(2);
    const box2 = b(100, 10, 1, UnitOfMeasurement.MM, UnitOfMeasurement.KM, UnitOfMeasurement.KM).stack(2);
    expect(box.l.value).toBe(100);
    expect(box.l.uom).toBe(UnitOfMeasurement.MM);
    expect(box.w.value).toBe(10);
    expect(box.w.uom).toBe(UnitOfMeasurement.MM);
    expect(box.h.value).toBe(2);
    expect(box.h.uom).toBe(UnitOfMeasurement.MM);

    expect(box2.l.value).toBe(10);
    expect(box2.l.uom).toBe(UnitOfMeasurement.KM);
    expect(box2.w.value).toBe(1);
    expect(box2.w.uom).toBe(UnitOfMeasurement.KM);
    expect(box2.h.value).toBe(200);
    expect(box2.h.uom).toBe(UnitOfMeasurement.MM);
  });

  test.each([
    { dim: b(1, 2, 3), expLow: 1, expMed: 2, expMax: 3 },
    { dim: b(1, 1, 2), expLow: 1, expMed: 1, expMax: 2 },
    { dim: b(1, 1, 1), expLow: 1, expMed: 1, expMax: 1 },
    {
      dim: b(1, 1, 1, UnitOfMeasurement.MM, UnitOfMeasurement.MM, UnitOfMeasurement.M),
      expLow: 1,
      expMed: 1,
      expMax: 1,
    },
  ])('lowestDim, medianDim, maxDim work %s', ({ dim, expLow, expMed, expMax }) => {
    expect(dim.lowestDim.value).toBe(expLow);
    expect(dim.medianDim.value).toBe(expMed);
    expect(dim.maxDim.value).toBe(expMax);
  });

  test.each([
    { box: b(1, 2, 3), content: b(1, 1, 1), exp: true },
    { box: b(1, 2, 3), content: b(1, 2, 3), exp: true },
    { box: b(1, 2, 3), content: b(3, 1, 2), exp: true },

    { box: b(1, 2, 3), content: b(1, 3, 3), exp: false },
    { box: b(1, 2, 3), content: b(3, 3, 3), exp: false },

    { box: b(1, 2, 3), content: b(1, 2, 3), qty: 2, exp: false },
    { box: b(1, 2, 3), content: b(1, 1, 1), qty: 2, exp: true },
    { box: b(100, 40, 3), content: b(10, 3, 2), qty: 2, exp: true },
    { box: b(10, 1, 1), content: b(1, 1, 1), qty: 10, exp: true },
  ])('fits work', ({ box, content, qty, exp }) => {
    expect(box.fits(content, qty)).toBe(exp);
  });
});
