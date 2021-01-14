import { convert, PropertyOptions } from '../utils';
import { Clause, toClause } from './Clause';
import { Table } from './Table';
import { Text } from '../types';

export class Column implements Text {
  constructor(readonly table: Table, readonly name: string, readonly options?: PropertyOptions) {}

  get count(): Counter {
    return new Counter(this, 'COUNT');
  }

  get max(): Counter {
    return new Counter(this, 'MAX');
  }

  get min(): Counter {
    return new Counter(this, 'MIN');
  }

  get sum(): Counter {
    return new Counter(this, 'SUM');
  }

  get average(): Counter {
    return new Counter(this, 'AVG');
  }

  get length(): Counter {
    return new Counter(this, 'LEN');
  }

  get asc(): Order {
    return new Order(this, 'ASC');
  }

  get desc(): Order {
    return new Order(this, 'DESC');
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
  constructor(protected col: Column, protected readonly alias: string) {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${this.col.toString()} AS ${this.alias}`;
  }
}

export type CounterType = 'COUNT' | 'LEN' | 'MAX' | 'MIN' | 'AVG' | 'SUM';

export class Counter extends Column {
  constructor(col: Column, private readonly type: CounterType) {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${this.type}(${this.name})`;
  }
}

export class Order extends Column {
  constructor(col: Column, private readonly direction: 'ASC' | 'DESC') {
    super(col.table, col.name, col.options);
  }

  toString(): string {
    return `${super.toString()} ${this.direction}`;
  }
}
