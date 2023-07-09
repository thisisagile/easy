import { checkDefined } from "./Check";

export function toMatchArray(this: jest.MatcherContext, received: any[], expected: any[]) {
  return checkDefined(this, received, expected)
    .not(([r, e]) => r.length === e.length, ([r, e]) => `Received array has length ${r.length}, while expected array has length ${e.length}.`)
    .not(([r, e]) => r.every((el, i) => this.equals(el, e[i])), "Elements in {r} do not match elements in {e}. \n\n {diff}.")
    .else();
}

expect.extend({
  toMatchArray
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchArray(expected: any[]): R;
    }
  }
}