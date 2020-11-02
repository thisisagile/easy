import { Dev } from "../ref/Dev";
import { validate } from "../../src/validation";

describe("Validate", () => {

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
