import { isDefined, json, Json, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Struct implements Validatable {
  constructor(protected readonly state: any = {}) {}

  get isValid(): boolean {
    return validate(this).isValid;
  }

  toJSON(): Json {
    return json.delete(json.parse({ ...this }), 'state');
  }

  toString(): string {
    return this.constructor.name;
  }

  update(_add: Json): Struct {
    return this;
  }

  protected merge(a: unknown): Json {
    return json.merge(this, a);
  }
}

export function isStruct(s?: unknown): s is Struct {
  return isDefined(s) && s instanceof Struct;
}
