import '@thisisagile/easy-test';
import { Dimension, UnitOfMeasurement } from '../../../src';

describe('Dimension', () => {

  test('dimension with out l, b, h is not valid', () => {
    const dim = new Dimension();
    expect(dim).not.toBeValid();
  });

  test('dimension with uom', () => {
    const dim: Dimension = new Dimension({
      length: 100,
      lenghtUOM: UnitOfMeasurement.MM,
      width: 200,
      widthUOM: UnitOfMeasurement.CM,
      height: 300,
      heightUOM: UnitOfMeasurement.KM,
    });
    expect(dim).toBeValid();
    // eslint-disable-next-line
    expect(dim.length).toBe(100);
    expect(dim.width).toBe(200);
    expect(dim.height).toBe(300);
    expect(dim.lengthUOM).toBe(UnitOfMeasurement.MM);
    expect(dim.widthUOM).toBe(UnitOfMeasurement.CM);
    expect(dim.heightUOM).toBe(UnitOfMeasurement.KM);
  });

  test('dimension without uom', () => {
    const dim: Dimension = new Dimension({ length: 100, width: 200, height: 300 });
    expect(dim).toBeValid();
    // eslint-disable-next-line
    expect(dim.length).toBe(100);
    expect(dim.width).toBe(200);
    expect(dim.height).toBe(300);
    expect(dim.lengthUOM).toBe(UnitOfMeasurement.MM);
    expect(dim.widthUOM).toBe(UnitOfMeasurement.MM);
    expect(dim.heightUOM).toBe(UnitOfMeasurement.MM);
  });
});