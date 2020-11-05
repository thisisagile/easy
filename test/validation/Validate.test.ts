import { Dev } from "../ref/Dev";
import { Results, validate, validateReject } from "../../src/validation";

describe("validate", () => {

  test("Works on empty objects", () => {
    expect(validate()).toHaveLength(1);
    expect(validate(null)).toHaveLength(1);
  });

  test("Works on invalid objects", () => {
    const dev = new Dev({level: 1});
    expect(validate(dev)).toHaveLength(2);
  });

  test("Works on valid objects", () => {
    const dev = Dev.Sander;
    expect(validate(dev)).toHaveLength(0);
  });
});

describe("validateReject", () => {

  test("Resolves when ok", () => {
    expect(validateReject(Dev.Sander)).resolves.toBe(Dev.Sander);
  })

  test("Rejects when fails", () => {
    expect(validateReject(new Dev({level: 1}))).rejects.toBeInstanceOf(Results);
  })
});
