import { ifGet, list, List } from '../types';
import { Column, OrderColumn } from './Column';
import { Join } from './Join';
import { SqlQuery } from './SqlQuery';
import { Table } from './Table';

export class Select extends SqlQuery {
  protected ordered: List<OrderColumn> = list();
  protected grouped: List<Column> = list();
  protected top = 0;

  constructor(table: Table | Join, readonly columns: List<Column> = list()) {
    super(table);
  }

  from(t?: Table | Join): this {
    this.table = t ?? this.table;
    return this;
  }

  orderBy = (...ordered: OrderColumn[]): this => {
    this.ordered.add(ordered);
    return this;
  };

  groupBy(...grouped: Column[]): this {
    this.grouped.add(grouped);
    return this;
  }

  limit(limit: number): this {
    this.top = limit;
    return this;
  }

  toString(): string {
    return (
      `SELECT ` +
      ifGet(this.top, `TOP ${this.top} `, '') +
      ifGet(this.columns.length, this.columns.join(`, `), '*') +
      ` FROM ${this.table}` +
      ifGet(this.clauses.length, ` WHERE ${this.clauses.join(` AND `)}`, '') +
      ifGet(this.grouped.length, ` GROUP BY ${this.grouped.join(`, `)}`, '') +
      ifGet(this.ordered.length, ` ORDERED BY ${this.ordered.join(`, `)};`, ';')
    );
  }
}
