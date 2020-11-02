import { isResult, result, Result, Text, Validatable } from "../types";
import { toArray } from "../utils";

export const parse = (...rs: (Text | Result)[]): Result[] => toArray(rs).map(r => isResult(r) ? r : result(r.toString(), "easy"));

export class Results implements Validatable {
  public readonly results: Result[];

  constructor(...rs: (Text | Result)[]) {
    this.results = parse(...rs);
  }

  get length(): number { return this.results.length; }

  get isValid(): boolean { return this.results.length === 0; }

  add = (...rs: (Text | Result)[]): Results => new Results(...this.results, ...parse(...rs));
}

export const results = (...r: (Text | Result)[]): Results => new Results(...r);
