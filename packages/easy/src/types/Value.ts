import { isDefined, JsonValue, Validatable } from './index';

export class Value<V extends JsonValue = string> implements Validatable {
  constructor(readonly value: V) {
    this.value = value;
  }

  get isValid(): boolean {
    return isDefined(this.value);
  }

  toJSON(): JsonValue {
    return this.value;
  }

  toString(): string {
    return this.value?.toString() ?? '';
  }
}

export const isValue = (v?: unknown): v is Value => v instanceof Value;
