import { Query } from './Query';

export class Delete extends Query {
  toString(): string { return `DELETE FROM ${this.table} ` + (this.clauses ? `WHERE ${this.clauses.join(` AND `)}` : ``); }
}
