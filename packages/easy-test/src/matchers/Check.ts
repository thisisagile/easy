import { isDefined } from "../utils/Utils";
import CustomMatcherResult = jest.CustomMatcherResult;


type ToMessage<S> = string | ((s: S[]) => string);

class Check<S> {
  constructor(private ctx: jest.MatcherContext, private readonly received: S, private readonly expected: S, private readonly failed = false, private readonly message = "") {
  }

  print(message: ToMessage<S>): string {
    return (typeof message === "function" ? message([this.received, this.expected]) : message)
      .replace("{r}", this.ctx.utils.printReceived(this.received))
      .replace("{e}", this.ctx.utils.printExpected(this.expected))
      .replace("{diff}", this.ctx.utils.diff(this.received, this.expected) ?? "");
  }

  not(p: (s: (S)[]) => boolean, message: ToMessage<S>): Check<S> {
    if (this.failed) {
      return this;
    }
    try {
      return new Check<S>(this.ctx, this.received, this.expected, !p([this.received, this.expected]), this.print(message));
    } catch (e: any) {
      return new Check<S>(this.ctx, this.received, this.expected, true, e.message);
    }
  }

  undefined(p: (s: (S)[]) => any, message: ToMessage<S>): Check<S> {
    return this.not(() => isDefined(p([this.received, this.expected])), this.print(message));
  }

  else(message: ToMessage<S> = "Expected {r} not to match with {e}, but it did."): CustomMatcherResult {
    return {
      pass: !this.failed,
      message: () => (this.failed ? this.message : this.print(message))
    };
  }
}

export const check = <S>(ctx: jest.MatcherContext, received: S, expected?: S): Check<S> => new Check<S>(ctx, received, expected as S);

export const checkDefined = <S>(ctx: jest.MatcherContext, received: S, expected?: S): Check<S> => new Check<S>(ctx, received, expected as S)
  .undefined(([r]) => r, "Received array is undefined.")
  .undefined(([, e]) => e, "Expected array is undefined.")
;

