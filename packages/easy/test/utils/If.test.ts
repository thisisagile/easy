import { mock } from '@thisisagile/easy-test';
import { given, ifDefined, ifEither, ifEmpty, ifEqual, ifFalse, ifNotEmpty, ifTrue } from '../../src';
import { Dev } from '../ref';

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

  describe('IfEmpty', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifEmpty([], () => hello)).toEqual(hello);
      expect(
        ifEmpty(
          [],
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(hello.toUpperCase());
      expect(
        ifEmpty(
          [{}],
          () => hello,
          () => goodbye
        ).toUpperCase()
      ).toEqual(goodbye.toUpperCase());
    });

    test('call f on empty array.', () => {
      expect(
        ifEmpty(
          [],
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call f on empty string.', () => {
      expect(
        ifEmpty(
          '',
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call f on undefined.', () => {
      expect(
        ifEmpty(
          undefined,
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call f on null.', () => {
      expect(
        ifEmpty(
          null,
          () => f(),
          () => alt()
        )
      ).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt when not empty.', () => {
      expect(
        ifEmpty(
          [{}, {}],
          () => f(),
          () => alt()
        )
      ).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('return undefined when alt is not given.', () => {
      expect(ifEmpty([{}], () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });

    test('return value tested if f is not given and empty.', () => {
      expect(ifEmpty([])).toStrictEqual([]);
    });

    test('return undefined if f is not given and not empty.', () => {
      expect(ifEmpty({ name: 'Sander' })).toBeUndefined();
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

  describe('given', () => {
    type Options = { title?: string; count?: number };
    type Titles = { title: string };

    test('take the value when the key is there', () => {
      expect(given({ title: 'Hello' }, 'title', 'World')).toBe('Hello');
    });

    test('take the alt when the key is missing', () => {
      expect(given<Options, 'title'>({}, 'title', 'World')).toBe('World');
    });

    test('keep an undefined value over the alt when the key is there', () => {
      expect(given<Options, 'title'>({ title: undefined }, 'title', 'World')).toBeUndefined();
    });

    test('return undefined when alt is not given.', () => {
      expect(given<Options, 'title'>({}, 'title')).toBeUndefined();
    });

    test('take a falsy value over the alt', () => {
      expect(given({ count: 0 }, 'count', 42)).toBe(0);
    });

    test('evaluate the alt lazily', () => {
      const alt = mock.return('World');
      expect(given({ title: 'Hello' }, 'title', alt)).toBe('Hello');
      expect(alt).not.toHaveBeenCalled();
      expect(given<Options, 'title'>({}, 'title', alt)).toBe('World');
      expect(alt).toHaveBeenCalledTimes(1);
    });

    test('typings', () => {
      expect(given({ title: 'Hello' } as Titles, 'title', 'World').toUpperCase()).toBe('HELLO');
      expect(given({} as Titles, 'title', 'World').toUpperCase()).toBe('WORLD');
    });
  });

  describe('ifEqual', () => {
    let f: jest.Mock;
    let alt: jest.Mock;

    beforeEach(() => {
      f = mock.return('f');
      alt = mock.return('alt');
    });

    test('typings', () => {
      expect(ifEqual(42, 42, () => hello)).toEqual(hello);
      expect(ifEqual(42, 42, () => hello, () => goodbye).toUpperCase()).toEqual(hello.toUpperCase());
      expect(ifEqual(42, 0, () => hello, () => goodbye).toUpperCase()).toEqual(goodbye.toUpperCase());
    });

    test('call f when equal', () => {
      expect(ifEqual('a', 'a', () => f(), () => alt())).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('call alt when not equal', () => {
      expect(ifEqual('a', 'b', () => f(), () => alt())).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
    });

    test('return undefined when alt is not given and not equal', () => {
      expect(ifEqual(1, 2, () => f())).toBeUndefined();
      expect(f).not.toHaveBeenCalled();
    });

    test('works with objects', () => {
      expect(ifEqual({ a: 1 }, { a: 1 }, () => f(), () => alt())).toBe('f');
      expect(f).toHaveBeenCalled();
      expect(alt).not.toHaveBeenCalled();
    });

    test('works with unequal objects', () => {
      expect(ifEqual({ a: 1 }, { a: 2 }, () => f(), () => alt())).toBe('alt');
      expect(f).not.toHaveBeenCalled();
      expect(alt).toHaveBeenCalled();
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

    test('work with complex AND empty objects', () => {
      expect(
        ifEither(
          [undefined, Dev.Wouter, {} as Dev],
          d => d.name,
          () => 'default'
        )
      ).toBe('Wouter');
    });
  });
});
