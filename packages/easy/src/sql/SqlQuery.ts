import { Query } from '../data/Query';
import { Table } from './Table';
import { Join } from './Join';
import { List, toList } from '../types/List';
import { Clause } from './Clause';

export class SqlQuery implements Query {
  constructor(
    protected table: Table | Join,
    readonly clauses: List<Clause> = toList()
  ) {}

  where = (...clauses: Clause[]): this => {
    this.clauses.add(clauses);
    return this;
  };
}
