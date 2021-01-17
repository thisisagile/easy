import { Query } from './Query';
import { Table } from './Table';
import { Json } from '../types';
import { quote } from './Clause';

export class Insert extends Query {
  constructor(protected table: Table, protected fields: Json) {
    super(table);
  }

  toString(): string {
    return (
      `INSERT INTO ${this.table} ` +
      `(${Object.keys(this.fields).join(', ')}) OUTPUT INSERTED.* ` +
      `VALUES (${Object.values(this.fields)
        .map(v => quote(v))
        .join(', ')})`
    );
  }
}
