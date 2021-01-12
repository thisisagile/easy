import { Id, Json, SqlServerProvider, TableGateway } from '../../src';
import { DevTable } from './DevTable';

export class DevTableGateway extends TableGateway {
  constructor() {
    super(DevTable, new SqlServerProvider());
  }

  byId = (id: Id): Promise<Json> => this.provider.query(this.table.select().where(this.table.id.is(id))).then(js => js.first());
}
