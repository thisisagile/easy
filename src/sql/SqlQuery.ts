import { Clause, Join, List, list, Table } from '../index';
import { Query } from '../data';

export class SqlQuery implements Query {
  constructor(protected table: Table | Join, readonly clauses: List<Clause> = list()) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}
