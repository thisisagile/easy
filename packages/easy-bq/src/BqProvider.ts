import { BigQuery } from '@google-cloud/bigquery';
import { Database, Exception, Json, List, reject, resolve, toList } from '@thisisagile/easy';

export class BqProvider {
  constructor(
    readonly db: Database,
    private readonly client = new BigQuery({ projectId: db.options?.projectId })
  ) {}

  query = (sql: string, params?: Record<string, unknown>): Promise<List<Json>> =>
    resolve(this.client.query({ query: sql, useLegacySql: false, params }))
      .then(([rows]) => toList(rows as Json[]))
      .catch(e => reject(Exception.CouldNotExecute(this.db).because(e)));
}
