import '@thisisagile/easy-test';
import { UnitOfWeight } from '../../../src';

describe('UnitOfWeight', () => {
  test('default construction.', () => {
    expect(UnitOfWeight.MG.id).toBe('mg');
    expect(UnitOfWeight.MG.gMultiplier).toBe(0.001);
    expect(UnitOfWeight.G.id).toBe('g');
    expect(UnitOfWeight.G.gMultiplier).toBe(1);
    expect(UnitOfWeight.KG.id).toBe('kg');
    expect(UnitOfWeight.KG.gMultiplier).toBe(1000);
  });
});
