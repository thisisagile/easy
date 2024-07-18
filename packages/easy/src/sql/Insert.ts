import { SqlQuery } from './SqlQuery';
import { quote } from './Clause';
import { Table } from './Table';
import { Json } from '../types/Json';

export class Insert extends SqlQuery {
  constructor(
    protected table: Table,
    protected fields: Json
  ) {
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
