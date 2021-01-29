import { Json, toJson, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Record implements Validatable {
  constructor(protected readonly state: any = {}) {}

  get isValid(): boolean {
    return validate(this).isValid;
  }

  toJSON(): Json {
    return toJson({ ...this, state: undefined });
  }

  toString(): string {
    return this.constructor.name;
  }

  update = (add?: Json): Record => this;

  protected merge = (a: Json): Json => toJson(this, a);
}
