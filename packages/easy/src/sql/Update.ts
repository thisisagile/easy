import { SqlQuery } from './SqlQuery';
import { ifGet, Json } from '../types';
import { toClause } from './Clause';
import { Table } from './Table';

export class Update extends SqlQuery {
  constructor(protected table: Table, protected fields: Json) {
    super(table);
  }

  toString(): string {
    return (
      `UPDATE ${this.table} ` +
      `SET ${Object.entries(this.fields)
        .map(([k, v]) => toClause(k, '=', v))
        .join(', ')} ` +
      'OUTPUT INSERTED.*' +
      ifGet(this.clauses.length, ` WHERE ${this.clauses.join(' AND ')};`, ';')
    );
  }
}
