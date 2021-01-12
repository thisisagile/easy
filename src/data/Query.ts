import { Clause, Database, List, list } from '../index';

export class Query {
  constructor(readonly db: Database, readonly clauses: List<Clause> = list()) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}
