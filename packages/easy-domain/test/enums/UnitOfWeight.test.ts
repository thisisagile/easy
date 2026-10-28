import '@thisisagile/easy-test';
import UnitOfWeight from '../../src/entries/UnitOfWeight';

describe('UnitOfWeight', () => {
  test('default construction.', () => {
    expect(UnitOfWeight.MG.id).toBe('mg');
    expect(UnitOfWeight.MG.gMultiplier).toBe(0.001);
    expect(UnitOfWeight.G.id).toBe('g');
    expect(UnitOfWeight.G.gMultiplier).toBe(1);
    expect(UnitOfWeight.KG.id).toBe('kg');
    expect(UnitOfWeight.KG.gMultiplier).toBe(1000);
  });

  test('queries the explicit catalogue', () => {
    expect(UnitOfWeight.byId('kg')).toBe(UnitOfWeight.KG);
    expect(UnitOfWeight.filter(unit => unit.gMultiplier >= 1)).toEqual([UnitOfWeight.G, UnitOfWeight.KG]);
  });

  test('creates custom units', () => {
    const unit = UnitOfWeight.create('Test', 'tst', 42);

    expect(unit).toBeInstanceOf(UnitOfWeight.Enum);
    expect(unit.gMultiplier).toBe(42);
  });
});
