import '@thisisagile/easy-test';
import { Dimension, UnitOfMeasurement } from '../../../src';

describe('Dimension', () => {
  test('Dimension without value is not valid', () => {
    const d = new Dimension({ uom: UnitOfMeasurement.KM });
    const d2 = new Dimension({});
    expect(d).not.toBeValid();
    expect(d2).not.toBeValid();
  });

  test('Dimension works', () => {
    const d = new Dimension({ value: 100, uom: UnitOfMeasurement.KM });
    const d2 = new Dimension({ value: 10 });
    expect(d.value).toBe(100);
    expect(d.uom).toBe(UnitOfMeasurement.KM);
    expect(d2.value).toBe(10);
    expect(d2.uom).toBe(UnitOfMeasurement.MM);
  });

  test('With without uom sets it to mm', () => {
    const d = Dimension.with(10);
    expect(d.value).toBe(10);
    expect(d.uom).toBe(UnitOfMeasurement.MM);
  });

  test('With works', () => {
    const d = Dimension.with(10, UnitOfMeasurement.CM);
    expect(d.value).toBe(10);
    expect(d.uom).toBe(UnitOfMeasurement.CM);
  });

  test('SizeInMM works', () => {
    const d = Dimension.with(10, UnitOfMeasurement.M);
    expect(d.sizeInMM()).toBe(10000);
  });

  test('gte works', () => {
    const smallDim = Dimension.with(1);
    const bigDim = Dimension.with(1000);
    expect(smallDim.gte(bigDim)).toBeFalsy();
    expect(bigDim.gte(smallDim)).toBeTruthy();
    expect(smallDim.gte(smallDim)).toBeTruthy();
  });
});
