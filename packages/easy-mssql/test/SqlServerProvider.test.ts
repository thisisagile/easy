import { ConnectionPool, Request } from 'mssql';
import { mock } from '@thisisagile/easy-test';
import { SqlServerProvider } from '../src';
import { DevDatabase, DevTable } from './ref/DevTable';

describe('SqlServerProvider', () => {
  const table = new DevTable();
  const query = table.select().where(table.id.is(3));
  const pool = mock.empty<ConnectionPool>();
  const request = mock.empty<Request>();
  const set = { recordset: { key1: 1, key2: 2, key3: 3 }, rowsAffected: [1] };
  let provider: SqlServerProvider;

  beforeEach(() => {
    pool.request = mock.return(request);
    request.query = mock.resolve();
    provider = new SqlServerProvider(DevDatabase.DevDB, pool);
  });

  test('Query method works when execute succeeds', async () => {
    provider.execute = mock.resolve(set);
    await expect(provider.query(query)).resolves.toHaveLength(3);
    expect(provider.execute).toHaveBeenCalledWith(query);
  });

  test('Query method works when fails', async () => {
    provider.execute = mock.reject(new Error('Wrong'));
    await expect(provider.query(query)).rejects.toBeInstanceOf(Error);
    expect(provider.execute).toHaveBeenCalledWith(query);
  });

  test('Command method works when execute succeeds', async () => {
    provider.execute = mock.resolve(set);
    await expect(provider.command(query)).resolves.toBe(1);
    expect(provider.execute).toHaveBeenCalledWith(query);
  });

  test('Command method works when fails', async () => {
    provider.execute = mock.reject(new Error('Wrong'));
    await expect(provider.command(query)).rejects.toBeInstanceOf(Error);
    expect(provider.execute).toHaveBeenCalledWith(query);
  });

  test('Execute', async () => {
    await provider.execute(query);
    expect(pool.request).toHaveBeenCalledTimes(1);
    expect(request.query).toHaveBeenCalledWith(query.toString());
  });
});
