import { convert, PropertyOptions } from '../utils';
import { Clause, toClause } from './Clause';
import { Table } from './Table';
import { Text } from '../types';

export class Column implements Text {
  constructor(readonly table: Table, readonly name: string, readonly options?: PropertyOptions) {}

  get count(): Count {
    return new Count(this, 'COUNT');
  }

  get max(): Count {
    return new Count(this, 'MAX');
  }

  get min(): Count {
    return new Count(this, 'MIN');
  }

  get length(): Count {
    return new Count(this, 'LEN');
  }

  get asc(): Sort {
    return new Sort(this, 'ASC');
  }

  get desc(): Sort {
    return new Sort(this, 'DESC');
  }

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

  as = (alias: string): As => new As(this, alias);

  toString(): string {
    return `${this.table}.${this.name}`;
  }

  protected clause = (operator: string, value: unknown): Clause => toClause(this, operator, value, this?.options?.convert ?? convert.default);
}

export class As extends Column {
  constructor(col: Column, private readonly alias: string) {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${super.toString()} AS ${this.alias}`;
  }
}

export class Count extends Column {
  constructor(col: Column, private readonly counter: "COUNT" | "LEN" | "MAX" | "MIN") {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${this.counter}(${this.name})`;
  }
}

export class Sort extends Column {
  constructor(col: Column, private readonly direction: "ASC" | "DESC") {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${super.toString()} ${this.direction}`;
  }
}
