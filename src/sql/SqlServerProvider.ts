import { DataProvider, Query } from '../data';
import { Json, List, meta } from '../types';
import { resolve } from '../utils';

export class SqlServerProvider implements DataProvider {
  execute = (q: Query): Promise<any> => resolve({q});

  query = (q: Query): Promise<List<Json>> => this.execute(q).then(r => meta(r.recordset).values());
  command = (q: Query): Promise<number> => this.execute(q).then(r => r.rowsAffected[0]);
}
