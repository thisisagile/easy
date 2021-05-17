import { SqlQuery } from './SqlQuery';
import { Json } from '../types';
import { quote } from './Clause';
import { Table } from './Table';

export class Insert extends SqlQuery {
  constructor(protected table: Table, protected fields: Json) {
    super(table);
  }

  toString(): string {
    return (
      `INSERT INTO ${this.table} ` +
      `(${Object.keys(this.fields).join(', ')}) OUTPUT INSERTED.* ` +
      `VALUES (${Object.values(this.fields)
        .map(v => quote(v))
        .join(', ')});`
    );
  }
}
