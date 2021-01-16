import { convert, Database, SqlServerProvider, Table } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database('DevDB', new SqlServerProvider());
}

export class DevTable extends Table {
  readonly db = DevDatabase.DevDB;
  readonly id = this.prop('Id', { def: 42 });
  readonly name = this.prop('Name');
  readonly language = this.prop('Language', { def: 'TypeScript' });
  readonly level = this.prop('CodingLevel', { def: 3, convert: convert.toNumber.fromString });
}
