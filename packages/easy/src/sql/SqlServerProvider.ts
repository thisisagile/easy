import { Database, Query, QueryProvider } from '../data';
import { asString, Exception, Json, List, meta } from '../types';
import { reject } from '../utils';
import { ConnectionPool, IResult } from 'mssql';

export class SqlServerProvider implements QueryProvider {
  constructor(readonly db: Database, private pool?: ConnectionPool) {}

  execute = (q: Query): Promise<IResult<Json>> => {
    return (this.pool ?? (this.pool = new ConnectionPool(asString(this.db.options?.connectionString))))
      .request()
      .query(q.toString())
      .catch(e => reject(Exception.CouldNotExecute(this.db, e)));
  };

  query = (q: Query): Promise<List<Json>> => this.execute(q).then(r => meta(r.recordset).values());
  command = (q: Query): Promise<number> => this.execute(q).then(r => r.rowsAffected[0]);
}
