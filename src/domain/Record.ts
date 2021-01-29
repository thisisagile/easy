import { Json, toJson, Validatable } from '../types';
import { validate } from '../validation';

export abstract class Record implements Validatable {
  constructor(protected readonly state: any = {}) {}

  get isValid(): boolean {
    return validate(this).isValid;
  }

  /**
   * @deprecated add parameter, use merge instead
   */
  toJSON(add: Json = {}): Json {
    return typeof add !== "string" ? toJson({ ...this, ...add, state: undefined }) : toJson({ ...this, state: undefined });
  }

  toString(): string {
    return this.constructor.name;
  }

  update = (add?: Json): Record => this;

  protected merge = (a: Json): Json => ({ ...toJson(this), ...a });
}
