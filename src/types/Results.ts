import { Text } from './Text';
import { isResult, toResult, Result } from './Result';
import { Validatable } from './Validatable';
import { isDefined } from './Is';

const parse = (...rs: (Text | Result)[]): Result[] => rs.map(r => (isResult(r) ? r : toResult(r)));

export class Results implements Validatable {
  public readonly results: Result[];

  constructor(...rs: (Text | Result)[]) {
    this.results = parse(...rs);
  }

  get length(): number {
    return this.results.length;
  }

  get isValid(): boolean {
    return this.results.length === 0;
  }

  add = (...rs: (Text | Result)[]): Results => toResults(...this.results, ...parse(...rs));

  combine = (other: Results): Results => this.add(...other.results);
}

export const toResults = (...r: (Text | Result)[]): Results => new Results(...r);

export const isResults = (r?: unknown): r is Results => isDefined(r) && r instanceof Results;
