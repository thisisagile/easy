import {
  Entity,
  isArray,
  isBoolean,
  isDefined,
  isEmpty,
  isEmptyObject,
  isIn,
  isInstance,
  isIntersecting,
  isIsoDateString,
  isNotEmpty,
  isNotPresent,
  isNumber,
  isObject,
  isPresent,
  isString,
  isTrue,
  isUndefined,
} from '../../src';
import { Dev } from '../ref';

describe('isDefined', () => {
  test('isDefined false', () => {
    expect(isDefined()).toBeFalsy();
    expect(isDefined(undefined)).toBeFalsy();
    expect(isDefined(null)).toBeFalsy();
  });

  test('isDefined true', () => {
    expect(isDefined('')).toBeTruthy();
    expect(isDefined({})).toBeTruthy();
    expect(isDefined([])).toBeTruthy();
    expect(isDefined(Dev.Jeroen)).toBeTruthy();
  });
});

describe('isEmpty', () => {
  test('isEmpty false', () => {
    expect(isEmpty({})).toBeFalsy();
    expect(isEmpty([42])).toBeFalsy();
    expect(isEmpty(Dev.Jeroen)).toBeFalsy();
  });

  test('isEmpty true', () => {
    expect(isEmpty()).toBeTruthy();
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
  });
});

describe('isNotEmpty', () => {
  test('isNotEmpty true', () => {
    expect(isNotEmpty({})).toBeTruthy();
    expect(isNotEmpty([42])).toBeTruthy();
    expect(isNotEmpty(Dev.Jeroen)).toBeTruthy();
  });

  test('isNotEmpty false', () => {
    expect(isNotEmpty()).toBeFalsy();
    expect(isNotEmpty('')).toBeFalsy();
    expect(isNotEmpty(undefined)).toBeFalsy();
    expect(isNotEmpty(null)).toBeFalsy();
    expect(isNotEmpty([])).toBeFalsy();
  });
});

describe('isString', () => {
  test('isString false', () => {
    expect(isString()).toBeFalsy();
    expect(isString({})).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString(Dev.Jeroen)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(null)).toBeFalsy();
  });

  test('isString true', () => {
    expect(isString('')).toBeTruthy();
  });
});

describe('isIsoDateString', () => {
  test('isIsoDateString false', () => {
    expect(isIsoDateString()).toBeFalsy();
    expect(isIsoDateString({})).toBeFalsy();
    expect(isIsoDateString([])).toBeFalsy();
    expect(isIsoDateString(Dev.Jeroen)).toBeFalsy();
    expect(isIsoDateString(undefined)).toBeFalsy();
    expect(isIsoDateString(null)).toBeFalsy();
    expect(isIsoDateString('Hello World')).toBeFalsy();
    expect(isIsoDateString('2020-11-02')).toBeFalsy();
    expect(isIsoDateString('2020-11-02T23:00:00')).toBeFalsy();
    expect(isIsoDateString('2020-11-02T23:00:00.000')).toBeFalsy();
    expect(isIsoDateString('bla bla bla 2020-11-02T23:00:00.000Z bla bla bla')).toBeFalsy();
    expect(isIsoDateString('b2020-11-02T23:00:00.000Z')).toBeFalsy();
    expect(isIsoDateString('2020-11-02T23:00:00.000Zb')).toBeFalsy();
  });

  test('isIsoDateString true', () => {
    expect(isIsoDateString('2020-11-02T23:00:00.000Z')).toBeTruthy();
  });
});

describe('isObject', () => {
  test('isObject false', () => {
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject()).toBeFalsy();
    expect(isObject('')).toBeFalsy();
    expect(isObject([])).toBeFalsy();
  });

  test('isObject true', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject(Dev.Jeroen)).toBeTruthy();
  });
});

describe('isEmptyObject', () => {
  class Empty {}

  test('isEmptyObject false', () => {
    expect(isEmptyObject(undefined)).toBeFalsy();
    expect(isEmptyObject(null)).toBeFalsy();
    expect(isEmptyObject()).toBeFalsy();
    expect(isEmptyObject('')).toBeFalsy();
    expect(isEmptyObject([])).toBeFalsy();
    expect(isEmptyObject(Dev)).toBeFalsy();
    expect(isEmptyObject(Dev.Jeroen)).toBeFalsy();
  });

  test('isEmptyObject true', () => {
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject(new Empty())).toBeTruthy();
  });

  test.each([undefined, 0, false, '', () => false])('isFalse', s => {
    expect(isTrue(s)).toBeFalsy();
  });

  test.each([{}, [], 1, 42, true, 'false', 'true', 'something', () => true, () => () => true])('isTrue', s => {
    expect(isTrue(s)).toBeTruthy();
  });
});

describe('isArray', () => {
  test('isArray false', () => {
    expect(isArray(undefined)).toBeFalsy();
    expect(isArray(null)).toBeFalsy();
    expect(isArray()).toBeFalsy();
    expect(isArray('')).toBeFalsy();
    expect(isArray({})).toBeFalsy();
    expect(isArray(Dev.Jeroen)).toBeFalsy();
  });

  test('isArray true', () => {
    expect(isArray([])).toBeTruthy();
  });
});

class Tester extends Entity {}

class Ux extends Dev {}

describe('isInstance', () => {
  test('Check', () => {
    expect(isInstance(Dev)).toBeFalsy();
    expect(isInstance(Dev, undefined)).toBeFalsy();
    expect(isInstance(Dev, null)).toBeFalsy();
    expect(isInstance(Dev, '')).toBeFalsy();
    expect(isInstance(Dev, {})).toBeFalsy();
    expect(isInstance(Dev, Dev.Jeroen)).toBeTruthy();
    expect(isInstance(Tester, Dev.Jeroen)).toBeFalsy();
    expect(isInstance(Dev, new Ux())).toBeTruthy();
    expect(isInstance(Ux, Dev.Wouter)).toBeFalsy();
  });
});

describe('isNumber', () => {
  test('Check', () => {
    expect(isNumber()).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();
    expect(isNumber('')).toBeFalsy();
    expect(isNumber({})).toBeFalsy();
    expect(isNumber(0)).toBeTruthy();
    expect(isNumber(123)).toBeTruthy();
    expect(isNumber(123.45)).toBeTruthy();
    expect(isNumber(false)).toBeFalsy();
    expect(isNumber(Dev)).toBeFalsy();
    expect(isNumber(Dev.Wouter)).toBeFalsy();
    expect(isNumber(() => true)).toBeFalsy();
    expect(isNumber([])).toBeFalsy();
  });
});

describe('isBoolean', () => {
  test('Check', () => {
    expect(isBoolean()).toBeFalsy();
    expect(isBoolean(null)).toBeFalsy();
    expect(isBoolean('')).toBeFalsy();
    expect(isBoolean({})).toBeFalsy();
    expect(isBoolean(0)).toBeFalsy();
    expect(isBoolean(true)).toBeTruthy();
    expect(isBoolean(false)).toBeTruthy();
    expect(isBoolean(Dev)).toBeFalsy();
    expect(isBoolean(Dev.Wouter)).toBeFalsy();
    expect(isBoolean(() => true)).toBeFalsy();
    expect(isBoolean([])).toBeFalsy();
  });
});

describe('isIn', () => {
  test('Check', () => {
    expect(isIn('a', ['b', 'c'])).toBeFalsy();
    expect(isIn('a', [])).toBeFalsy();
    expect(isIn('a', [null])).toBeFalsy();
    expect(isIn('a', [1])).toBeFalsy();
    expect(isIn('1', [1])).toBeFalsy();

    expect(isIn('a', ['a'])).toBeTruthy();
    expect(isIn('a', ['b', 'a'])).toBeTruthy();
  });
});

describe('isIntersecting', () => {
  test('Check', () => {
    expect(isIntersecting()).toBeFalsy();
    expect(isIntersecting(undefined, [])).toBeFalsy();
    expect(isIntersecting(undefined, [])).toBeFalsy();
    expect(isIntersecting(undefined, ['a'])).toBeFalsy();
    expect(isIntersecting([])).toBeFalsy();
    expect(isIntersecting(['a'])).toBeFalsy();
    expect(isIntersecting([], [])).toBeFalsy();
    expect(isIntersecting(['a'], [])).toBeFalsy();
    expect(isIntersecting([], ['a'])).toBeFalsy();
    expect(isIntersecting(['a'], ['b'])).toBeFalsy();
    expect(isIntersecting(['a'], ['b', 'c'])).toBeFalsy();
    expect(isIntersecting(['a', 'b'], ['c'])).toBeFalsy();
    expect(isIntersecting(['a', 'b'], ['a'])).toBeTruthy();
    expect(isIntersecting(['a', 'b'], ['a', 'c'])).toBeTruthy();
    expect(isIntersecting(['a', 'b'], ['b', 'c'])).toBeTruthy();
    expect(isIntersecting(['a', 'b', 'c'], ['b'])).toBeTruthy();
  });
});

describe('isUndefined', () => {
  test('Check', () => {
    expect(isUndefined()).toBeTruthy();
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(null)).toBeTruthy();
    expect(isUndefined('null')).toBeFalsy();
    expect(isUndefined({})).toBeFalsy();
  });
});

describe('isPresent', () => {
  test.each([
    [null, true],
    [undefined, true],
    ['', true],
    [[], true],
    [{}, true],
    ['hello', false],
    [[1, 2, 3], false],
    [{ a: 1 }, false],
  ])('returns %s for %s', (input, expected) => {
    expect(isNotPresent(input)).toBe(expected);
  });

  test.each([
    [null, false],
    [undefined, false],
    ['', false],
    [[], false],
    [{}, false],
    ['hello', true],
    [[1, 2, 3], true],
    [{ a: 1 }, true],
  ])('returns %s for %s', (input, expected) => {
    expect(isPresent(input)).toBe(expected);
  });

  test.each([
    ['undefined is not', undefined, false],
    ['null is not', null, false],
    ['empty string is not', '', false],
    ['empty object is not', {}, false],
    ['empty array is not', [], false],
    ['zero is', 0, true],
    ['a number is', 42, true],
    ['false is', false, true],
    ['true is', false, true],
    ['a string is', 'false', true],
    ['an object is', { valid: 'false' }, true],
    ['an entity is', Dev.Wouter, true],
    ['an array is', ['', ''], true],
  ])('%s present', (name: string, o: unknown, out: boolean) => {
    expect(isPresent(o)).toBe(out);
  });

  test('spreads that are present', () => {
    expect(isNotPresent(undefined, undefined)).toBeTruthy();
    expect(isNotPresent('undefined', undefined)).toBeTruthy();
    expect(isNotPresent(Dev.Eugen, undefined)).toBeTruthy();
    expect(isNotPresent([], undefined)).toBeTruthy();
    expect(isNotPresent([], [])).toBeTruthy();
  });

  test('spreads that are not present', () => {
    expect(isNotPresent('undefined', 'undefined')).toBeFalsy();
    expect(isNotPresent('undefined', Dev.Rob)).toBeFalsy();
    expect(isNotPresent(Dev.Eugen, Dev.Jeroen)).toBeFalsy();
    expect(isNotPresent([Dev.Eugen], Dev.Jeroen)).toBeFalsy();
    expect(isNotPresent([Dev.Eugen], [Dev.Jeroen])).toBeFalsy();
  });
});
