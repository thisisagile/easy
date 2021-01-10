import { Clause, list, List } from '../index';

export class SqlQuery {
  constructor(readonly clauses: List<Clause> = list()) {}

  where(...clauses: Clause[]): this {
    this.clauses.add(clauses);
    return this;
  }
}
