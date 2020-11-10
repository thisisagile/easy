import { isArray, isDefined, isEmpty, isNotEmpty, isObject, isString } from '../../src/types';
import { Dev } from "../ref/Dev";

describe("isDefined", () => {
  test("Returns false", () => {
    expect(isDefined()).toBeFalsy();
    expect(isDefined(undefined)).toBeFalsy();
    expect(isDefined(null)).toBeFalsy();
  });

  test("Returns true", () => {
    expect(isDefined("")).toBeTruthy();
    expect(isDefined({})).toBeTruthy();
    expect(isDefined([])).toBeTruthy();
    expect(isDefined(Dev.Jeroen)).toBeTruthy();
  });
});

describe("isEmpty", () => {
  test("Returns false", () => {
    expect(isEmpty({})).toBeFalsy();
    expect(isEmpty([])).toBeFalsy();
    expect(isEmpty(Dev.Jeroen)).toBeFalsy();
  });

  test("Returns true", () => {
    expect(isEmpty()).toBeTruthy();
    expect(isEmpty("")).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
  });
});

describe("isNotEmpty", () => {
  test("Returns true", () => {
    expect(isNotEmpty({})).toBeTruthy();
    expect(isNotEmpty([])).toBeTruthy();
    expect(isNotEmpty(Dev.Jeroen)).toBeTruthy();
  });

  test("Returns false", () => {
    expect(isNotEmpty()).toBeFalsy();
    expect(isNotEmpty("")).toBeFalsy();
    expect(isNotEmpty(undefined)).toBeFalsy();
    expect(isNotEmpty(null)).toBeFalsy();
  });
});

describe("isString", () => {
  test("Returns false", () => {
    expect(isString()).toBeFalsy();
    expect(isString({})).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString(Dev.Jeroen)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(null)).toBeFalsy();
  });

  test("Returns true", () => {
    expect(isString("")).toBeTruthy();
  });
});

describe("isObject", () => {
  test("Returns false", () => {
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject()).toBeFalsy();
    expect(isObject("")).toBeFalsy();
    expect(isObject([])).toBeFalsy();
  });

  test("Returns true", () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject(Dev.Jeroen)).toBeTruthy();
  });
});

describe("isArray", () => {
  test("Returns false", () => {
    expect(isArray(undefined)).toBeFalsy();
    expect(isArray(null)).toBeFalsy();
    expect(isArray()).toBeFalsy();
    expect(isArray("")).toBeFalsy();
    expect(isArray({})).toBeFalsy();
    expect(isArray(Dev.Jeroen)).toBeFalsy();
  });

  test("Returns true", () => {
    expect(isArray([])).toBeTruthy();
  });
});
