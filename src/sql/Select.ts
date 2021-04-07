import { ifGet, List, toList } from '../types';
import { Column, OrderColumn } from './Column';
import { Join } from './Join';
import { SqlQuery } from './SqlQuery';
import { Table } from './Table';

export class Select extends SqlQuery {
  protected ordered: List<OrderColumn> = toList();
  protected grouped: List<Column> = toList();
  protected _top = 0;
  protected _limit = 0;
  protected _offset = 0;

  constructor(table: Table | Join, readonly columns: List<Column> = toList()) {
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

  top(t: number): this {
    this._top = t;
    return this;
  }

  limit(l: number): this {
    this._limit = l;
    return this;
  }

  offset(o: number): this {
    this._offset = o;
    return this;
  }

  toString(): string {
    return (
      `SELECT ` +
      ifGet(this._top, `TOP ${this._top} `, '') +
      ifGet(this.columns.length, this.columns.join(`, `), '*') +
      ` FROM ${this.table}` +
      ifGet(this.clauses.length, ` WHERE ${this.clauses.join(` AND `)}`, '') +
      ifGet(this.grouped.length, ` GROUP BY ${this.grouped.join(`, `)}`, '') +
      ifGet(this.ordered.length, ` ORDERED BY ${this.ordered.join(`, `)}`, '') +
      ifGet(this._limit, ` LIMIT ${this._limit}`, '') +
      ifGet(this._offset, ` OFFSET ${this._offset};`, ';')
    );
  }
}
