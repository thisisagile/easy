import { ifGet, list, List } from '../types';
import { Column, OrderColumn } from './Column';
import { Table } from './Table';
import { Query } from './Query';

export class Select extends Query {
  protected ordered: List<OrderColumn> = list();
  protected grouped: List<Column> = list();
  protected limit = 0;

  constructor(table: Table, readonly columns: List<Column> = list()) {
    super(table);
  }

  top = (limit: number): this => {
    this.limit = limit;
    return this;
  };

  orderBy = (...ordered: OrderColumn[]): this => {
    this.ordered.add(ordered);
    return this;
  };

  groupBy(...grouped: Column[]): this {
    this.grouped.add(grouped);
    return this;
  }

  toString(): string {
    return (
      `SELECT ` +
      ifGet(this.limit, `TOP ${this.limit} `, '') +
      ifGet(this.columns.length, this.columns.join(`, `), '*') + ' ' +
      `FROM ${this.table}` +
      ifGet(this.clauses.length, ` WHERE ${this.clauses.join(` AND `)}`, '') +
      ifGet(this.grouped.length, ` GROUP BY ${this.grouped.join(`, `)}`, '') +
      ifGet(this.ordered.length, ` ORDERED BY ${this.ordered.join(`, `)}`, '')
    );
  }
}
