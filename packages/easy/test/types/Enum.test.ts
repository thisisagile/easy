import { Dev, DevRepo, Language, LanguageValue } from '../ref';
import '@thisisagile/easy-test';
import { Enum, Id } from '../../src';
import { isEnumRegistry, lazyRegistry, registry } from '../../src/types/Registry';

describe('Enum', () => {
  class ValueOnly extends Enum {
    constructor(name: string, id?: Id) {
      super(name, id);
    }
  }

  test('only owns value behaviour', () => {
    const value = new ValueOnly('Value');
    expect(value.equals('value')).toBe(true);
    expect(ValueOnly).not.toHaveProperty('all');
    expect(ValueOnly).not.toHaveProperty('byId');
    expect(ValueOnly).not.toHaveProperty('isEnum');
  });

  test('constructs values with identity and code', () => {
    expect(Language.Java.name).toBe('Java');
    expect(Language.Java.id).toBe('java');
    expect(Language.Java.code).toBe('java');
    expect(Language.JavaScript.code).toBe('js');
  });

  test('supports equality, membership and serialization', () => {
    expect(Language.Java.equals('java')).toBe(true);
    expect(Language.Java.equals(Language.JavaScript)).toBe(false);
    expect(Language.Java.isIn(Language.JavaScript, Language.TypeScript)).toBe(false);
    expect(Language.Java.isIn(Language.Java, Language.TypeScript)).toBe(true);
    expect(Language.Java.toJSON()).toBe('java');
    expect(Language.Java).toMatchText('java');
    expect(Language.Java).toBeValid();
  });

  test('recognizes registry contracts independently from values and constructors', () => {
    expect(isEnumRegistry({})).toBe(false);
    expect(isEnumRegistry(Language.byId)).toBe(false);
    expect(isEnumRegistry(Dev)).toBe(false);
    expect(isEnumRegistry(DevRepo)).toBe(false);
    expect(isEnumRegistry(ValueOnly)).toBe(false);
    expect(isEnumRegistry(Language)).toBe(true);
  });

  describe('registry', () => {
    test('supports catalogue queries without reflecting class statics', () => {
      expect(Language.all()).toEqual([Language.Cobol, Language.Java, Language.JavaScript, Language.TypeScript]);
      expect(Language.byId('java')).toBe(Language.Java);
      expect(Language.byIds(['typescript', 'missing', 'typescript'])).toEqual([Language.TypeScript]);
      expect(Language.filter((language, index) => language === Language.Java || index === 0)).toEqual([Language.Cobol, Language.Java]);
      expect(Language.first(language => language === Language.TypeScript)).toBe(Language.TypeScript);
      expect(Language.first()).toBe(Language.Cobol);
      expect(Language.byId('java')).toBeInstanceOf(LanguageValue);
    });

    test('supports value and thunk fallbacks for unknown ids', () => {
      expect(Language.byId('missing')).toBeUndefined();
      expect(Language.byId('missing', Language.Java)).toBe(Language.Java);
      expect(Language.byId('missing', () => Language.TypeScript)).toBe(Language.TypeScript);
    });

    test('keeps the last value for duplicate ids', () => {
      const first = new ValueOnly('First', 'duplicate');
      const last = new ValueOnly('Last', 'duplicate');
      const duplicates = registry({ first, last });
      expect(duplicates.all()).toEqual([last]);
      expect(duplicates.byId('duplicate')).toBe(last);
    });

    test('keeps registry snapshots isolated', () => {
      const values = { Java: Language.Java };
      const java = registry(values);
      const typescript = registry({ TypeScript: Language.TypeScript });
      values.Java = Language.Cobol;
      expect(java.all()).toEqual([Language.Java]);
      expect(typescript.all()).toEqual([Language.TypeScript]);
    });

    test('defers lazy registry construction until a catalogue query is used', () => {
      const values = jest.fn(() => ({ Java: Language.Java }));
      const languages = lazyRegistry(values);

      expect(values).not.toHaveBeenCalled();
      expect(languages.byId('java')).toBe(Language.Java);
      expect(languages.all()).toEqual([Language.Java]);
      expect(values).toHaveBeenCalledTimes(1);
    });
  });
});
