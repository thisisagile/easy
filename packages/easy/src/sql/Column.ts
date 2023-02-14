import { Property, PropertyOptions } from '../utils';
import { Clause, toClause } from './Clause';
import { Json, JsonValue, ofGet, Text, tryTo } from '../types';
import { Table } from './Table';

export class Column extends Property implements Text {
  constructor(readonly owner: Table, property: string, options?: PropertyOptions) {
    super(property, options);
  }

  get count(): Column {
    return this.function('COUNT');
  }

  get max(): Column {
    return this.function('MAX');
  }

  get min(): Column {
    return this.function('MIN');
  }

  get sum(): Column {
    return this.function('SUM');
  }

  get average(): Column {
    return this.function('AVG');
  }

  get length(): Column {
    return this.function('LEN');
  }

  get asc(): OrderColumn {
    return this.format('$col ASC') as OrderColumn;
  }

  get desc(): OrderColumn {
    return this.format('$col DESC') as OrderColumn;
  }

  in = (source: Json = {}): JsonValue =>
    tryTo(source)
      .map(s => s[this.property] ?? ofGet(this.options?.dflt))
      .map(v => this.options?.convert?.to(v))
      .orElse();

  out = (source: Json = {}, key = ''): JsonValue =>
    tryTo(source)
      .map(s => this.options?.convert?.from(s[key]))
      .orElse();

  function = (func: string): Column => this.format(`${func}($name)`);

  format = (pattern: string): Column => new PatternColumn(this, pattern);

  is = (value: unknown): Clause => this.clause('=', value);

  not = (value: unknown): Clause => this.clause('<>', value);

  like = (value: unknown): Clause => this.clause('LIKE', `%${value}%`);

  startsLike = (value: unknown): Clause => this.clause('LIKE', `${value}%`);

  endsLike = (value: unknown): Clause => this.clause('LIKE', `%${value}`);

  unlike = (value: unknown): Clause => this.clause('NOT LIKE', `%${value}%`);

  less = (value: unknown): Clause => this.clause('<', value);

  lessEqual = (value: unknown): Clause => this.clause('<=', value);

  greater = (value: unknown): Clause => this.clause('>', value);

  greaterEqual = (value: unknown): Clause => this.clause('>=', value);

  as = (as: string): Column => this.format(`$col AS ${as}`);

  toString(): string {
    return `${this.owner}.${this.property}`;
  }

  protected clause = (operator: string, value: unknown): Clause => toClause(this, operator, value, this?.options?.convert);
}

export class PatternColumn extends Column {
  constructor(protected col: Column, protected pattern: string) {
    super(col.owner, col.property);
  }

  toString(): string {
    return this.pattern.replace('$col', this.col.toString()).replace('$table', this.col.owner.toString).replace('$name', this.col.property);
  }
}

export class OrderColumn extends PatternColumn {}
