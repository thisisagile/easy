import { ifArray, ifBoolean, ifNumber, ifObject, ifString, ifType } from '../../src';

describe('IfType', () => {
  const hello = 'Hello World';
  const goodbye = 'Goodbye World';

  describe('ifType', () => {
    const isEven = (o: unknown): o is number => typeof o === 'number' && o % 2 === 0;

    test('call f when predicate matches', () => {
      expect(ifType(2, isEven, n => n * 2)).toBe(4);
    });

    test('call alt when predicate does not match', () => {
      expect(
        ifType(
          3,
          isEven,
          n => n * 2,
          () => -1
        )
      ).toBe(-1);
    });

    test('return undefined when predicate does not match and alt is not given', () => {
      expect(ifType(3, isEven, n => n * 2)).toBeUndefined();
    });

    test('using alt ensures non-optional return', () => {
      expect(
        ifType(
          2,
          isEven,
          n => n,
          () => 0
        ).toFixed()
      ).toBe('2');
      expect(
        ifType(
          3,
          isEven,
          n => n,
          () => 0
        ).toFixed()
      ).toBe('0');
    });
  });

  describe('ifString', () => {
    test('call f when value is a string', () => {
      expect(ifString(hello, s => s.toUpperCase())).toBe(hello.toUpperCase());
    });

    test('call alt when value is not a string', () => {
      expect(
        ifString(
          42,
          s => s,
          () => goodbye
        )
      ).toBe(goodbye);
    });

    test('return undefined when value is not a string and alt is not given', () => {
      expect(ifString(42, s => s)).toBeUndefined();
    });

    test('typings: alt ensures non-optional return', () => {
      expect(
        ifString(
          hello,
          s => s,
          () => goodbye
        ).toUpperCase()
      ).toEqual(hello.toUpperCase());
      expect(
        ifString(
          42,
          s => s,
          () => goodbye
        ).toUpperCase()
      ).toEqual(goodbye.toUpperCase());
    });

    test('works with empty string', () => {
      expect(
        ifString(
          '',
          s => s.length,
          () => -1
        )
      ).toBe(0);
    });
  });

  describe('ifNumber', () => {
    test('call f when value is a number', () => {
      expect(ifNumber(42, n => n * 2)).toBe(84);
    });

    test('call alt when value is not a number', () => {
      expect(
        ifNumber(
          'not a number',
          n => n,
          () => -1
        )
      ).toBe(-1);
    });

    test('return undefined when value is not a number and alt is not given', () => {
      expect(ifNumber('not a number', n => n)).toBeUndefined();
    });

    test('typings: alt ensures non-optional return', () => {
      expect(
        ifNumber(
          42,
          n => n,
          () => 0
        ).toFixed()
      ).toBe('42');
      expect(
        ifNumber(
          'x',
          n => n,
          () => 0
        ).toFixed()
      ).toBe('0');
    });

    test('returns undefined for NaN', () => {
      expect(ifNumber(NaN, n => n)).toBeUndefined();
    });
  });

  describe('ifBoolean', () => {
    test('call f when value is a boolean', () => {
      expect(ifBoolean(true, b => !b)).toBe(false);
    });

    test('call alt when value is not a boolean', () => {
      expect(
        ifBoolean(
          'yes',
          b => b,
          () => false
        )
      ).toBe(false);
    });

    test('return undefined when value is not a boolean and alt is not given', () => {
      expect(ifBoolean('yes', b => b)).toBeUndefined();
    });

    test('works with false value', () => {
      expect(ifBoolean(false, b => !b)).toBe(true);
    });
  });

  describe('ifArray', () => {
    test('call f when value is an array', () => {
      expect(ifArray([1, 2, 3], a => a.length)).toBe(3);
    });

    test('call alt when value is not an array', () => {
      expect(
        ifArray(
          'not an array',
          a => a.length,
          () => -1
        )
      ).toBe(-1);
    });

    test('return undefined when value is not an array and alt is not given', () => {
      expect(ifArray('not an array', a => a.length)).toBeUndefined();
    });

    test('works with empty array', () => {
      expect(
        ifArray(
          [],
          a => a.length,
          () => -1
        )
      ).toBe(0);
    });
  });

  describe('ifObject', () => {
    const obj = { name: 'Sander', age: 30 };

    test('call f when value is an object', () => {
      expect(ifObject(obj, o => o['name'])).toBe('Sander');
    });

    test('call alt when value is not an object', () => {
      expect(
        ifObject(
          'not an object',
          o => o,
          () => ({})
        )
      ).toStrictEqual({});
    });

    test('return undefined when value is not an object and alt is not given', () => {
      expect(ifObject('not an object', o => o)).toBeUndefined();
    });

    test('does not match arrays', () => {
      expect(
        ifObject(
          [1, 2],
          o => o,
          () => ({})
        )
      ).toStrictEqual({});
    });
  });
});
