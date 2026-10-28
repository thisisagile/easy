import { Enum } from '@thisisagile/easy/types/Enum';
import { equalsNormalizedId, normalizeId } from '../../src/enums/NormalizedId';

describe('NormalizedId', () => {
  class TestEnum extends Enum {
    constructor(name: string, id: string) {
      super(name, id);
    }
  }

  test('normalizes case and surrounding whitespace', () => {
    expect(normalizeId(' NL ')).toBe('nl');
  });

  test('compares strings and enum values by normalized id', () => {
    const value = new TestEnum('Netherlands', ' NL ');

    expect(equalsNormalizedId(value.id, 'nl')).toBe(true);
    expect(equalsNormalizedId(value.id, new TestEnum('Netherlands', 'NL'))).toBe(true);
    expect(equalsNormalizedId(value.id, 'be')).toBe(false);
  });
});
