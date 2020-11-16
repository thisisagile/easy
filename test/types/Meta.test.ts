import "reflect-metadata";
import { Dev } from "../ref/Dev";
import { meta } from '../../src/types';

describe("Meta", () => {

  let dev: Dev;

  beforeEach(() => {
    dev = new Dev({ name: "Jeroen", language: "TypeScript" });
  });

  test("Class decorator works", () => {
    const m = meta(dev);
    expect(m.set("salary", 5000)).toBe(5000);
    expect(m.get("salary")).toBe(5000);
  });

  test("Property decorator works", () => {
    const pm = meta(dev).property("name");
    expect(pm.set("valid", true)).toBeTruthy();
    const pm2 = meta(dev).property("name");
    expect(pm2.get("valid")).toBeTruthy();
  });
});
