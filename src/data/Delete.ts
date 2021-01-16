import { Query } from './Query';
import { ifGet } from '../types';

export class Delete extends Query {
  toString(): string {
    return `DELETE FROM ${this.table}` + ifGet(this.clauses.length, ` WHERE ${this.clauses.join(` AND `)}`, '');
  }
}
