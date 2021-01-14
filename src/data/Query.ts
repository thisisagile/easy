import { Clause, List, list, Table } from '../index';

export class Query {
  constructor(protected table: Table, readonly clauses: List<Clause> = list()) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}
