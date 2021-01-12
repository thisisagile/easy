import { Database, list, Query } from '../../src';
import { DevTable } from '../ref';

describe('Query', () => {
  const devs = new DevTable();
  let query: Query;

  beforeEach(() => {
    query = new Query(Database.Main);
  });

  test('Adding clauses works', () => {
    expect(query.clauses).toHaveLength(0);
    query.where(devs.name.is('Wouter'));
    expect(query.clauses).toHaveLength(1);
  });

  test('Adding clauses on to of works', () => {
    const query = new Query(Database.Main, list(devs.level.is(3)));
    expect(query.clauses).toHaveLength(1);
    query.where(devs.name.is('Naoufal'));
    expect(query.clauses).toHaveLength(2);
  });
});
