import { Clause, Join, List, Table, toList } from '../index';
import { Query } from '../data';

export class SqlQuery implements Query {
  constructor(protected table: Table | Join, readonly clauses: List<Clause> = toList()) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}
