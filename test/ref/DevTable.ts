import { convert, Database, SqlServerProvider, Table } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database('DevDB', new SqlServerProvider());
}

export class DevTable extends Table {
  readonly db = DevDatabase.DevDB;
  readonly id = this.prop('Id', { dflt: 42 });
  readonly name = this.prop('Name');
  readonly language = this.prop('Language', { dflt: 'TypeScript' });
  readonly level = this.prop('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}
