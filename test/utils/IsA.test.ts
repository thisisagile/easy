import { isA } from "../../src/types";
import { Dev } from "../ref/Dev";

describe("IsA", () => {

  test("isA works", () => {
    expect(isA<Dev>()).toBeFalsy();
    expect(isA<Dev>({})).toBeTruthy();
    expect(isA<Dev>(Dev.Sander)).toBeTruthy();
    expect(isA<Dev>(Dev.Sander, "name", "language")).toBeTruthy();
  });
});
