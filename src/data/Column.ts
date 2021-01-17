import { convert, Property, PropertyOptions } from '../utils';
import { Clause, toClause } from './Clause';
import { Table } from './Table';
import { Text } from '../types';

export class Column implements Text, Property {
  constructor(readonly owner: Table, readonly name: string, readonly options: PropertyOptions = {}) {
    this.options = { def: options?.def, convert: options?.convert ?? convert.default };
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
    return `${this.owner}.${this.name}`;
  }

  protected clause = (operator: string, value: unknown): Clause => toClause(this, operator, value, this?.options?.convert);
}

export class PatternColumn extends Column {
  constructor(protected col: Column, protected pattern: string) {
    super(col.owner, col.name);
  }

  toString(): string {
    return this.pattern.replace('$col', this.col.toString()).replace('$table', this.col.owner.toString).replace('$name', this.col.name);
  }
}

export class OrderColumn extends PatternColumn {}
