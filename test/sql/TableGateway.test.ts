import { DataProvider, TableGateway, toList } from '../../src';
import { DevTable } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('TableGateway', () => {
  const table = new DevTable();
  let target: TableGateway<DevTable>;
  const provider: DataProvider = mock.empty<DataProvider>();

  beforeEach(() => {
    target = new TableGateway(table, provider);
  });

  test('byId', async () => {
    const id = 11;
    provider.query = mock.resolve(toList({ Id: 6, Name: 'Pawel', CodingLevel: '3', Language: 'python' }));
    await expect(target.byId(id)).resolves.toStrictEqual(expect.objectContaining({
      id: 6,
      name: 'Pawel',
      level: 3,
      language: 'python',
    }));
    expect(provider.query).toBeQueriedWith(table.select().where(table.id.is(id)));
  });
});
