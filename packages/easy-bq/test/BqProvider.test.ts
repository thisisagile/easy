import { mock } from '@thisisagile/easy-test';
import { BigQuery } from '@google-cloud/bigquery';
import { BqProvider } from '../src';
import { DevBqDatabase } from './ref/DevBqDatabase';

describe('BqProvider', () => {
  let client: BigQuery;
  let provider: BqProvider;

  const rows = [{ id: '1', name: 'test' }];

  beforeEach(() => {
    client = mock.a<BigQuery>({ query: mock.resolve([rows]) });
    provider = new BqProvider(DevBqDatabase.DevBQ, client);
  });

  test('query passes sql to client', async () => {
    await provider.query('SELECT 1');

    expect(client.query).toHaveBeenCalledWith({ query: 'SELECT 1', useLegacySql: false, params: undefined });
  });

  test('query passes params to client', async () => {
    await provider.query('SELECT * FROM t WHERE id = @id', { id: '42' });

    expect(client.query).toHaveBeenCalledWith({ query: 'SELECT * FROM t WHERE id = @id', useLegacySql: false, params: { id: '42' } });
  });

  test('query returns rows as list', async () => {
    const result = await provider.query('SELECT 1');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: '1', name: 'test' });
  });

  test('query rejects on error', async () => {
    client.query = mock.reject(new Error('BQ error'));

    await expect(provider.query('SELECT 1')).rejects.toMatchObject({ message: expect.stringContaining('Could not execute') });
  });
});
