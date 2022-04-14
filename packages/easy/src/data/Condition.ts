import { json, Json, JsonValue } from '../types';
import { convert, Convert } from '../utils';

export class Condition {
  constructor(readonly key: string, readonly operator: string, readonly value: unknown) {}

  and = (...others: Condition[]): LogicalCondition => new LogicalCondition('and', [this, ...others]);
  or = (...others: Condition[]): LogicalCondition => new LogicalCondition('or', [this, ...others]);

  toJSON(): Json {
    return { [this.key]: { [`$${this.operator}`]: json.parse(this.value) } };
  }
}

export class LogicalCondition {
  constructor(readonly operator: string, readonly conditions: Condition[]) {}

  toJSON(): Json {
    return { [`$${this.operator}`]: this.conditions.map(c => c.toJSON()) };
  }
}

export class SortCondition extends Condition {
  constructor(readonly key: string, readonly value: number) {
    super(key, '', value);
  }

  toJSON(): Json {
    return { [this.key]: this.value };
  }
}

export const toCondition = (field: string, operator: string, value: unknown, conv: Convert = convert.default): Condition =>
  new Condition(field, operator, conv.from(value) as JsonValue);
