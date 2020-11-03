import { Json, JsonValue } from "../types";

export class Query {
  constructor(readonly key: string, readonly value: JsonValue) {}

  toJSON = (): Json => ({ [this.key]: this.value });
}

export const where = (key: string, value: JsonValue) => new Query(key, value);
