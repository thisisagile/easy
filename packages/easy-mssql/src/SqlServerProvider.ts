import { asString, Database, Exception, Json, List, meta, Query, QueryProvider, reject } from '@thisisagile/easy';
import { ConnectionPool, IResult } from 'mssql';

export class SqlServerProvider implements QueryProvider {
  constructor(readonly db: Database, private pool?: ConnectionPool) {}

  execute = (q: Query): Promise<IResult<Json>> => {
    return (this.pool ?? (this.pool = new ConnectionPool(asString(this.db.options?.connectionString))))
      .request()
      .query(q.toString())
      .catch(e => reject(Exception.CouldNotExecute(this.db).because(e)));
  };

  query = (q: Query): Promise<List<Json>> => this.execute(q).then(r => meta(r.recordset).values());
  command = (q: Query): Promise<number> => this.execute(q).then(r => r.rowsAffected[0]);
}
