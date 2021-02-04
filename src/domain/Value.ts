import { isA, isDefined, JsonValue, Validatable } from '../types';

export class Value<V extends JsonValue = string> implements Validatable {

  constructor(readonly value: V) { this.value = value; }

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

export const isValue = (v?: unknown): v is Value => isA<Value>(v, 'value', 'isValid');
