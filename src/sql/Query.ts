import { Clause, list, List, Column, Table } from '../index';

export class Query {
  constructor(readonly clauses: List<Clause> = list()) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}

export class Select extends Query {
  constructor(readonly subject: Table, readonly columns: Column[]) {
    super();
  }
}
