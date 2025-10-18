import { mock } from '@thisisagile/easy-test';
import { ifDefined, ifEither, ifFalse, ifNotEmpty, ifTrue } from '../../src';

describe('If', () => {
  const hello = 'Hello World';
  const goodbye = 'Goodbye World';
  describe('IfDefined', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifDefined(hello, s => s)).toEqual(hello);
      expect(ifDefined(hello, s => s, goodbye).toUpperCase()).toEqual(hello.toUpperCase());
      expect(ifDefined(undefined, s => s, goodbye).toUpperCase()).toEqual(goodbye.toUpperCase());
    });

    test('call f when defined.', () => {
      expect(ifDefined(undefined, () => 'a')).toBeUndefined();
      expect(ifDefined('defined', () => 'a')).toBe('a');
      expect(
        ifDefined(
          undefined,
          () => 'a',
          () => 'b'
        )
      ).toBe('b');
      expect(
        ifDefined(
          'defined',
          () => 'a',
          () => 'b'
        )
      ).toBe('a');
      expect(
        ifDefined(
          'undefined',
          s => s,
          () => 'b'
        )
      ).toBe('undefined');

      expect(
        ifDefined(
          'defined',
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt when not defined.', () => {
      expect(
        ifDefined(
          undefined,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('return undefined when alt is not given.', () => {
      expect(ifDefined(undefined, () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });
  });

  describe('IfNotEmpty', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifNotEmpty([{}], () => hello)).toEqual(hello);
      expect(
        ifNotEmpty(
          [{}],
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(hello.toUpperCase());
      expect(
        ifNotEmpty(
          [],
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(goodbye.toUpperCase());
    });

    test('call f when not empty.', () => {
      expect(
        ifNotEmpty(
          [{}, {}],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt on empty array.', () => {
      expect(
        ifNotEmpty(
          [],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call alt on empty string.', () => {
      expect(
        ifNotEmpty(
          '',
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('return undefined when alt is not given.', () => {
      expect(ifNotEmpty([], () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });

    test('return value tested if f is not given.', () => {
      expect(ifNotEmpty([])).toBeUndefined();
      expect(ifNotEmpty({ name: 'Sander' })).toStrictEqual({ name: 'Sander' });
    });
  });

  describe('IfTrue', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifTrue(true, () => hello)).toEqual(hello);
      expect(
        ifTrue(
          true,
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(hello.toUpperCase());
      expect(
        ifTrue(
          false,
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(goodbye.toUpperCase());
    });

    test('call f when true', () => {
      expect(ifTrue(true, () => f())).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call f when construct true', () => {
      expect(
        ifTrue(
          () => true,
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt when false.', () => {
      expect(
        ifTrue(
          '',
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('dont call f when construct false', () => {
      expect(
        ifTrue(
          () => false,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call alt when undefined', () => {
      expect(
        ifTrue(
          undefined,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('ifTrue returns undefined when alt is not given.', () => {
      expect(ifTrue(false, () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });
  });

  describe('ifFalse', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifFalse(false, () => hello)).toEqual(hello);
      expect(
        ifFalse(
          false,
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(hello.toUpperCase());
      expect(
        ifFalse(
          true,
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(goodbye.toUpperCase());
    });

    test('call f when true', () => {
      expect(
        ifFalse(
          true,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(alt).toHaveBeenCalled();
      expect(f).not.toHaveBeenCalled();
    });

    test('call f when construct true', () => {
      expect(
        ifFalse(
          () => true,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(alt).toHaveBeenCalled();
      expect(f).not.toHaveBeenCalled();
    });

    test('call alt when false.', () => {
      expect(
        ifFalse(
          '',
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(alt).not.toHaveBeenCalled();
      expect(f).toHaveBeenCalled();
    });

    test('dont call f when construct false', () => {
      expect(
        ifFalse(
          () => false,
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(alt).not.toHaveBeenCalled();
      expect(f).toHaveBeenCalled();
    });

    test('call alt when undefined', () => {
      expect(
        ifFalse(
          undefined,
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(alt).not.toHaveBeenCalled();
      expect(f).toHaveBeenCalled();
    });

    test('ifTrue returns undefined when alt is not given.', () => {
      expect(ifFalse(true, () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });
  });

  describe('ifEither', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifEither([undefined, hello], s => s)).toEqual(hello);
      expect(ifEither([undefined, hello], s => s, goodbye).toUpperCase()).toEqual(hello.toUpperCase());
      expect(ifEither([undefined, null], s => s, goodbye).toUpperCase()).toEqual(goodbye.toUpperCase());
      expect(ifEither([hello, goodbye], s => s.toUpperCase())).toEqual(hello.toUpperCase());
    });

    test('call f with first present value', () => {
      expect(
        ifEither(
          [undefined, null, 'present'],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call f with first present value ignoring later values', () => {
      expect(
        ifEither(
          ['first', 'second', 'third'],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt when all values are undefined', () => {
      expect(
        ifEither(
          [undefined, undefined, undefined],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call alt when all values are null', () => {
      expect(
        ifEither(
          [null, null, null],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call alt when all values are empty strings', () => {
      expect(
        ifEither(
          ['', '', ''],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call alt when all values are empty arrays', () => {
      expect(
        ifEither(
          [[], [], []],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('call f when mix of empty and present values', () => {
      expect(
        ifEither(
          [undefined, '', null, [], 'present'],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('return undefined when alt is not given and no values are present', () => {
      expect(ifEither([undefined, null, ''], () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });

    test('return value when f is not given and value is present', () => {
      expect(ifEither([undefined, { name: 'Sander' }])).toStrictEqual({ name: 'Sander' });
    });

    test('return undefined when f is not given and no values are present', () => {
      expect(ifEither([undefined, null, ''])).toBeUndefined();
    });

    test('work with single value', () => {
      expect(
        ifEither(
          'present',
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('work with single undefined value', () => {
      expect(
        ifEither(
          undefined,
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('handle zero value correctly', () => {
      expect(
        ifEither(
          [undefined, 0],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('handle false value correctly', () => {
      expect(
        ifEither(
          [undefined, false],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('pass the first present value to f', () => {
      const value = 'test-value';
      const mockF = jest.fn().mockReturnValue('result');

      ifEither([undefined, null, value], mockF);

      expect(mockF).toHaveBeenCalledWith(value);
    });

    test('work with complex objects', () => {
      const obj1 = { id: 1, name: 'first' };
      const obj2 = { id: 2, name: 'second' };

      expect(
        ifEither(
          [undefined, obj1, obj2],
          obj => obj.name,
          () => 'default'
        )
      ).toBe('first');
    });
  });
});
