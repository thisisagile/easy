import { Dev } from "../ref/Dev";
import { validate } from "../../src/validation/Validate";

describe("Validate", () => {

  test("Invalid dev works", () => {
    const dev = new Dev({level: 1});
    expect(validate(dev)).toHaveLength(2);
  });

  test("Valid dev works", () => {
    const dev = Dev.Sander;
    expect(validate(dev)).toHaveLength(0);
  });
});
