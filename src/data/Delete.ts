import { Query } from './Query';

export class Delete extends Query {
  toString(): string {
    return `DELETE FROM ${this.table}` + (this.clauses.length > 0 ? ` WHERE ${this.clauses.join(` AND `)}` : ``);
  }
}
