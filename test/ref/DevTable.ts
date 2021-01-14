import { convert, Database, SqlServerProvider, Table } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database('DevDB', new SqlServerProvider());
}

export class DevTable extends Table {
  readonly db = DevDatabase.DevDB;
  readonly id = this.col('Id', { def: 42 });
  readonly name = this.col('Name');
  readonly language = this.col('Language', {def: 'TypeScript'});
  readonly level = this.col('CodingLevel', { def: 3, convert: convert.toNumber.fromString });
}
