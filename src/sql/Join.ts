import { Column } from './Column';
import { Table } from './Table';

export class Join {
  readonly db = this.first.db;

  constructor(private first: Table, private second: Table, private c?: Column, private c2?: Column) {}

  on(c: Column, c2: Column): this {
    this.c = c;
    this.c2 = c2;
    return this;
  }

  toString(): string {
    return `${this.first} JOIN ${this.second} ON ${this.c} = ${this.c2}`;
  }
}
