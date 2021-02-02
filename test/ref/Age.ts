import { Value } from '../../src';

export class Age extends Value<number> {
  get isValid(): boolean {
    return this.value > 0 && this.value < 120;
  }
}
