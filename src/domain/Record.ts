import { Json, toJson, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Record implements Validatable {
  constructor(protected readonly state: any = {}) {}

  get isValid(): boolean {
    return validate(this).isValid;
  }

  toJSON(add: Json = {}): Json {
    return toJson({ ...this, ...add, state: undefined });
  }

  toString(): string {
    return this.constructor.name;
  }

  update = (add?: Json): Record => this;
}
