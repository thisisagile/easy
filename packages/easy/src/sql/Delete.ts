import { SqlQuery } from './SqlQuery';
import { ifGet } from '../types/Get';

export class Delete extends SqlQuery {
  toString(): string {
    return `DELETE FROM ${this.table}` + ifGet(this.clauses.length, ` WHERE ${this.clauses.join(' AND ')};`, ';');
  }
}
