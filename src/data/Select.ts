import { list, List } from '../types';
import { Column, Order } from './Column';
import { Table } from './Table';
import { Query } from './Query';

export class Select extends Query {
  readonly ordered: List<Order> = list();
  readonly grouped: List<Column> = list();
  protected limit = 0;

  constructor(readonly subject: Table, readonly columns: List<Column> = list()) {
    super(subject.db);
  }

  top = (limit: number): this => {
    this.limit = limit;
    return this;
  };

  orderBy = (...ordered: Order[]): this => {
    this.ordered.add(ordered);
    return this;
  };

  groupBy(...grouped: Column[]): this {
    this.grouped.add(grouped);
    return this;
  }

  toString(): string {
    return (
      `SELECT ${this.limit > 0 ? `TOP ${this.limit} ` : ``}` +
      `${this.columns.length > 0 ? this.columns.map(c => c.toString()).join(`, `) : `*`} ` +
      `FROM ${this.subject}` +
      (this.clauses.length > 0 ? ` WHERE ${this.clauses.join(` AND `)}` : ``) +
      (this.grouped.length > 0 ? ` GROUP BY ${this.grouped.join(`, `)}` : ``) +
      (this.ordered.length > 0 ? ` ORDERED BY ${this.ordered.join(`, `)}` : ``)
    );
  }
}
