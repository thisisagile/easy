import { isBoolean, isNumber } from '../types/Is';
import { convert, Convert } from '../utils/Convert';
import { TypeGuard } from '../types/TypeGuard';
import { isA } from '../types/IsA';
import type { Text } from '../types/Text';

export const quote = (a: unknown): string => (isNumber(a) || isBoolean(a) || isClause(a) ? a.toString() : `'${a as string}'`);

export class Clause implements Text {
  constructor(
    readonly first: unknown,
    readonly operator: string,
    readonly second: unknown
  ) {}

  and = (other: Clause): Clause => new ParathesizedClause(this, 'AND', other);
  or = (other: Clause): Clause => new ParathesizedClause(this, 'OR', other);

  toString(): string {
    return `${this.first} ${this.operator} ${quote(this.second)}`;
  }
}

export class ParathesizedClause extends Clause {
  toString(): string {
    return `(${this.first} ${this.operator} ${quote(this.second)})`;
  }
}

export const toClause = (first: unknown, operator: string, second: unknown, conv: Convert = convert.default): Clause =>
  new Clause(first, operator, conv.from(second));

export const isClause: TypeGuard<Clause> = (c?: unknown): c is Clause => isA<Clause>(c, 'and', 'or');
