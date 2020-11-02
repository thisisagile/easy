import { parse, Results, results } from "../../src/validation";
import { result, Result, Text } from "../../src/types";

describe("Results", () => {

  const error: Text = "Something went wrong.";
  const r: Result = result("Something else went wrong.", "dev");
  const res: Results = results(error, r);

  // Create

  test("Parse empty results", () => {
    const p = parse();
    expect(p).toHaveLength(0);
  });

  test("Create empty results", () => {
    const rs = results();
    expect(rs.results).toHaveLength(0);
    expect(rs.isValid).toBeTruthy();
  });

  test("Create with a single string", () => {
    const rs = results(error);
    expect(rs).toHaveLength(1);
    expect(rs.isValid).toBeFalsy();
    expect(rs.results[0].message).toBe(error);
  });

  test("Create with a single result", () => {
    const rs = results(r);
    expect(rs).toHaveLength(1);
    expect(rs.isValid).toBeFalsy();
    expect(rs.results[0].message).toBe(r.message);
  });

  test("Create with a text and a result", () => {
    const rs = results(error, r);
    expect(rs).toHaveLength(2);
    expect(rs.isValid).toBeFalsy();
    expect(rs.results[1].message).toBe(r.message);
  });

  // Add

  test("Add empty results", () => {
    const rs2 = res.add();
    expect(rs2).toHaveLength(2);
    expect(rs2.isValid).toBeFalsy();
  });

  test("Add with a single string", () => {
    const rs2 = res.add(error);
    expect(rs2).toHaveLength(3);
    expect(rs2.results[2].message).toBe(error);
  });

  test("Add with a single result", () => {
    const rs2 = res.add(r);
    expect(rs2).toHaveLength(3);
    expect(rs2.results[2].message).toBe(r.message);
  });

  test("Add with a text and a result", () => {
    const rs2 = res.add(error, r);
    expect(rs2).toHaveLength(4);
  });
});
