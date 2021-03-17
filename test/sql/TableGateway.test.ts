import { DataProvider, Query, TableGateway, toList } from '../../src';
import { DevTable } from '../ref';
import { match, mock } from '@thisisagile/easy-test';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveBeenQueriedWith(q: Query): R;
    }
  }
}

expect.extend({
  toHaveBeenQueriedWith(actual: any, expected: Query): jest.CustomMatcherResult {
    return match<Query>(actual?.mock?.calls?.[0]?.[0])
      .undefined(q => q, 'Query is unknown.')
      .not(
        q => q.toString() === expected.toString(),
        q => `Expected Query to be '${expected}', but got '${q}' instead`,
      )
      .else(`Query ${actual} does not match '${expected}'.`);
  },
});

describe('TableGateway', () => {
  const table = new DevTable();
  let target: TableGateway<DevTable>;
  const provider: DataProvider = mock.empty<DataProvider>();

  beforeEach(() => {
    target = new TableGateway(table, provider);
  });

  test('byId', async () => {
    const id = 11;
    provider.query = mock.resolve(toList({Id: 6, Name: "Pawel", CodingLevel: "3", Language: "python"}));
    await expect(target.byId(id)).resolves.toStrictEqual(expect.objectContaining({id: 6, name: "Pawel", level: 3, language: "python"}));
    expect(provider.query).toHaveBeenQueriedWith(table.select().where(table.id.is(id)));
  });
});
