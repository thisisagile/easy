import '@thisisagile/easy-test';
import { UnitOfMeasurement } from '../../src';

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
});
