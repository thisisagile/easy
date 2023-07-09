import { toMatchArray } from "../../src";
import "@thisisagile/easy-test";

class TestList<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, TestList.prototype);
  }
}

describe("toMatchArray", () => {

  test("fails", () => {
    expect(undefined).not.toMatchArray([1, 2, 3, 4]);
    expect({}).not.toMatchArray([1, 2, 3, 4]);
    expect([1, 2, 3]).not.toMatchArray([1, 2, 3, 4]);
    expect(new TestList(1, 2, 3, 4)).not.toMatchArray([1, 2, 3]);
    expect(new TestList(1, 2, 3, 4)).not.toMatchArray([1, 2, 3, 5]);
  });

  test("succeeds", () => {
    expect([]).toMatchArray([]);
    expect([1, 2, 3, 4]).toMatchArray([1, 2, 3, 4]);
    expect(new TestList(1, 2, 3, 4)).toMatchArray([1, 2, 3, 4]);
  });
});