import { isDefined, isEmpty, isString } from "../../src/types";
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
