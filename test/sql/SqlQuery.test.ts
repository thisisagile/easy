import { list, SqlQuery } from '../../src';
import { DevTable } from '../ref';

describe('SqlQuery', () => {

  const devs = new DevTable();
  let query: SqlQuery;

  beforeEach(() => {
    query = new SqlQuery();
  });

  test('Adding clauses works', () => {
    expect(query.clauses).toHaveLength(0);
    query.where(devs.name.is("Wouter"));
    expect(query.clauses).toHaveLength(1);
  });

  test('Adding clauses works', () => {
    const query = new SqlQuery(list(devs.level.is(3)));
    expect(query.clauses).toHaveLength(1);
    query.where(devs.name.is("Naoufal"));
    expect(query.clauses).toHaveLength(2);
  });
});
