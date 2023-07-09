import { check, mock } from "../../src";

describe("Check", () => {

  let ctx: jest.MatcherContext;

  const { a, return: returns } = mock;

  beforeEach(() => {
    ctx = a<jest.MatcherContext>();
  });

  test("received and expected are undefined", () => {
    const m = check(ctx, undefined, undefined);
    m.print = returns();
    expect(m.undefined(([r]) => r, '').else().pass).toBeFalsy();
    expect(m.undefined(([,e]) => e, '').else().pass).toBeFalsy();
  });

  test("received and expected are defined", () => {
    const m = check(ctx, {}, {});
    m.print = returns();
    expect(m.undefined(([r]) => r, '').else().pass).toBeTruthy();
    expect(m.undefined(([,e]) => e, '').else().pass).toBeTruthy();
  });

  test("property of received is undefined", () => {
    const m = check(ctx, {name: undefined}, {});
    m.print = returns();
    expect(m.undefined(([r]) => r.name, '').else().pass).toBeFalsy();
  });

  test("property of received is defined", () => {
    const m = check(ctx, {name: 'Sander'});
    m.print = returns();
    expect(m.undefined(([r]) => r.name, '').else().pass).toBeTruthy();
  });

  test("property of received is not valid", () => {
    const m = check(ctx, {name: 'Sander'});
    m.print = returns();
    expect(m.not(([r]) => r.name === 'Eugen', '').else().pass).toBeFalsy();
  });

  test("property of received is valid", () => {
    const m = check(ctx, {name: 'Claudia'});
    m.print = returns();
    expect(m.not(([r]) => r.name === 'Claudia', '').else().pass).toBeTruthy();
  });
});