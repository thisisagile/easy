import type { Enum as Database } from '@thisisagile/easy/Database';
import * as Exception from '@thisisagile/easy/Exception';
import { asString, Json, List, meta, Query, QueryProvider, reject, resolve } from '@thisisagile/easy';
import sql from 'mssql';
import type { ConnectionPool, IResult } from 'mssql';

export class SqlServerProvider implements QueryProvider {
  constructor(
    readonly db: Database,
    private pool?: ConnectionPool
  ) {}

  execute = (q: Query): Promise<IResult<Json>> => {
    this.pool = this.pool ?? new sql.ConnectionPool(asString(this.db.options?.connectionString));
    return resolve(this.pool)
      .then(p => (p.connected || p.connecting ? p : p.connect()))
      .then(p => p.request())
      .then(r => r.query(q.toString()))
      .catch(e => reject(Exception.CouldNotExecute(this.db).because(e)));
  };

  query = (q: Query): Promise<List<Json>> => this.execute(q).then(r => meta(r.recordset).values());
  command = (q: Query): Promise<number> => this.execute(q).then(r => r.rowsAffected[0]);
}
