import { describe, expect, Mock, test } from 'vitest';
import { mock, toBeQueriedWith } from '../../src';

describe('toBeQueriedWith', () => {
  const select = 'SELECT * FROM Table;';
  const un: Mock = undefined as unknown as Mock;
  const empty = mock.return();
  const query = { mock: { calls: [[{ toString: () => select }]] } } as unknown as Mock;

  test('fails', () => {
    expect(toBeQueriedWith(un, '')).toFailMatcherWith('Query is unknown.');
    expect(toBeQueriedWith(empty, '')).toFailMatcherWith('Query did not execute.');
    expect(toBeQueriedWith(query, 'NO SQL')).toFailMatcherWith("We expected query 'NO SQL', but we received query 'SELECT * FROM Table;' instead.");
  });

  test('passes', () => {
    expect(toBeQueriedWith(query, select)).toPassMatcherWith("Received query does match 'SELECT * FROM Table;', which we did not expect.");
  });
});
