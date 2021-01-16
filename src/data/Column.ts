import { convert, PropertyOptions } from '../utils';
import { Clause, toClause } from './Clause';
import { Table } from './Table';
import { Text } from '../types';

export class Column implements Text {
  constructor(readonly table: Table, readonly name: string, readonly options: PropertyOptions = {}) {}

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

  get asc(): Column {
    return this.format( '$col ASC');
  }

  get desc(): Column {
    return this.format( '$col DESC');
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

  toString(): string { return `${this.table}.${this.name}`; }

  protected clause = (operator: string, value: unknown): Clause => toClause(this, operator, value, this?.options?.convert ?? convert.default);
}

export class PatternColumn extends Column {
  constructor(protected col: Column, protected pattern: string) { super(col.table, col.name); }

  toString(): string {
    return this.pattern
      .replace('$col', this.col.toString())
      .replace('$table', this.col.table.toString)
      .replace('$name', this.col.name);
  }
}

export class Order extends Column {
  constructor(col: Column, private readonly direction: 'ASC' | 'DESC') {
    super(col.table, col.name);
  }

  toString(): string {
    return `${super.toString()} ${this.direction}`;
  }
}
