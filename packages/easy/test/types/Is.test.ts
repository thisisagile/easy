import {
  Entity,
  isArray,
  isBoolean,
  isDefined,
  isEmpty,
  isEmptyObject,
  isInstance,
  isIsoDateString,
  isNotEmpty,
  isNumber,
  isObject,
  isPrimitive,
  isString,
  isIn,
  isInSome,
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

describe('isNotEmptyObject', () => {
  class Empty {}

  test('isNotEmptyObject false', () => {
    expect(isEmptyObject(undefined)).toBeFalsy();
    expect(isEmptyObject(null)).toBeFalsy();
    expect(isEmptyObject()).toBeFalsy();
    expect(isEmptyObject('')).toBeFalsy();
    expect(isEmptyObject([])).toBeFalsy();
    expect(isEmptyObject(Dev)).toBeFalsy();
    expect(isEmptyObject(Dev.Jeroen)).toBeFalsy();
  });

  test('isNotEmptyObject true', () => {
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject(new Empty())).toBeTruthy();
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

describe('isPrimitive', () => {
  test('Check', () => {
    expect(isPrimitive()).toBeTruthy();
    expect(isPrimitive(null)).toBeTruthy();
    expect(isPrimitive('')).toBeTruthy();
    expect(isPrimitive({})).toBeFalsy();
    expect(isPrimitive(123)).toBeTruthy();
    expect(isPrimitive(false)).toBeTruthy();
    expect(isPrimitive(Dev)).toBeFalsy();
    expect(isPrimitive(Dev.Wouter)).toBeFalsy();
    expect(isPrimitive(() => true)).toBeFalsy();
    expect(isPrimitive([])).toBeFalsy();
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

describe('isInSome', () => {
  test('Check', () => {
    expect(isInSome()).toBeFalsy();
    expect(isInSome(undefined, [])).toBeFalsy();
    expect(isInSome(undefined, [])).toBeFalsy();
    expect(isInSome(undefined, ['a'])).toBeFalsy();
    expect(isInSome([])).toBeFalsy();
    expect(isInSome(['a'])).toBeFalsy();
    expect(isInSome([], [])).toBeFalsy();
    expect(isInSome(['a'], [])).toBeFalsy();
    expect(isInSome([], ['a'])).toBeFalsy();
    expect(isInSome(['a'], ['b'])).toBeFalsy();
    expect(isInSome(['a'], ['b', 'c'])).toBeFalsy();
    expect(isInSome(['a', 'b'], ['c'])).toBeFalsy();
    expect(isInSome(['a', 'b'], ['a'])).toBeTruthy();
    expect(isInSome(['a', 'b'], ['a', 'c'])).toBeTruthy();
    expect(isInSome(['a', 'b'], ['b', 'c'])).toBeTruthy();
    expect(isInSome(['a', 'b', 'c'], ['b'])).toBeTruthy();
  });
});
