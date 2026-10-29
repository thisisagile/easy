import '@thisisagile/easy-test';
import * as UnitOfMeasurement from '../../src/enums/UnitOfMeasurement';

describe('UnitOfMeasurement', () => {
  test('default construction.', () => {
    expect(UnitOfMeasurement.MM.id).toBe('mm');
    expect(UnitOfMeasurement.MM.mmMultiplier).toBe(1);
    expect(UnitOfMeasurement.CM.id).toBe('cm');
    expect(UnitOfMeasurement.CM.mmMultiplier).toBe(10);
    expect(UnitOfMeasurement.DM.id).toBe('dm');
    expect(UnitOfMeasurement.DM.mmMultiplier).toBe(100);
    expect(UnitOfMeasurement.M.id).toBe('m');
    expect(UnitOfMeasurement.M.mmMultiplier).toBe(1000);
    expect(UnitOfMeasurement.KM.id).toBe('km');
    expect(UnitOfMeasurement.KM.mmMultiplier).toBe(1000000);
  });

  test('queries the explicit catalogue', () => {
    expect(UnitOfMeasurement.byId('cm')).toBe(UnitOfMeasurement.CM);
    expect(UnitOfMeasurement.all()).toEqual([UnitOfMeasurement.MM, UnitOfMeasurement.CM, UnitOfMeasurement.DM, UnitOfMeasurement.M, UnitOfMeasurement.KM]);
  });

  test('creates custom units', () => {
    const unit = UnitOfMeasurement.create('Test', 'tst', 42);

    expect(unit).toBeInstanceOf(UnitOfMeasurement.Enum);
    expect(unit.mmMultiplier).toBe(42);
  });
});
