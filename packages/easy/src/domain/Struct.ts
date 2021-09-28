import { Constructor, json, Json, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Struct implements Validatable {
  constructor(protected readonly state: any = {}) {
  }

  get isValid(): boolean {
    return validate(this).isValid;
  }

  toJSON(): Json {
    return json.omit({ ...this }, 'state');
  }

  toString(): string {
    return this.constructor.name;
  }

  update<T extends Struct = Struct>(_add: Json): T {
    return new (this.constructor as Constructor<T>)(this.merge(_add));
  }

  protected merge = (a: Json): Json => json.merge(this, a);
}
