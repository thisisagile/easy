import { ifGet } from '../types';
import { Select } from './Select';

export class Count extends Select {
  toString(): string {
    return (
      `SELECT COUNT(*)` +
      ifGet(this._top, ` TOP ${this._top}`, '') +
      ` FROM ${this.table}` +
      ifGet(this.clauses.length, ` WHERE ${this.clauses.join(' AND ')}`, '') +
      ifGet(this.grouped.length, ` GROUP BY ${this.grouped.join(', ')}`, '') +
      ';'
    );
  }
}
