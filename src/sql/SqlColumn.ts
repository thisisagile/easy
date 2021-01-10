import { ColumnOptions, convert } from '../utils';
import { Clause, toClause } from './Clause';
import { Table } from './Table';
import { Text } from '../types';

export class SqlColumn<T = unknown> implements Text {
  constructor(readonly map: Table, readonly name: string, readonly options?: ColumnOptions) {}

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

  toString(): string {
    return `${this.map}.${this.name}`;
  }

  protected clause = (operator: string, value: unknown): Clause => toClause(this, operator, value, this?.options?.convert ?? convert.default);
}
