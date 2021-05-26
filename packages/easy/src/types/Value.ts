import { asString, isDefined, JsonValue, Validatable } from './index';

export class Value<V extends unknown = string> implements Validatable {
  constructor(readonly value: V) {
    this.value = value;
  }

  get isValid(): boolean {
    return isDefined(this.value);
  }

  toJSON(): JsonValue {
    return this.value as JsonValue;
  }

  toString(): string {
    return asString(this.value);
  }
}

export const isValue = (v?: unknown): v is Value => v instanceof Value;
