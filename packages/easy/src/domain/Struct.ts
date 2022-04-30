import { isDefined, json, Json, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Struct implements Validatable {
  constructor(protected readonly state: any = {}) {}

  get isValid(): boolean {
    return validate(this).isValid;
  }

  toJSON(): Json {
    return json.omit({ ...this }, 'state');
  }

  toString(): string {
    return this.constructor.name;
  }

  update = (_add: Json): Struct => this;

  protected merge = (a: unknown): Json => json.merge(this, a);
}

export const isStruct = (s?: unknown): s is Struct => isDefined(s) && s instanceof Struct;