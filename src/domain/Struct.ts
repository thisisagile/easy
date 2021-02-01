import { json, Json, Validatable } from '../types';
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

  update = (add?: Json): Struct => this;

  protected merge = (a: Json): Json => json.merge(this, a);
}
