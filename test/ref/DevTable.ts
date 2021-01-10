import { convert, Database, Table } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database("DevDB");
}

export class DevTable extends Table {
  readonly db = DevDatabase.DevDB;
  readonly id = this.col('Id', { default: 42 });
  readonly name = this.col('Name');
  readonly level = this.col('CodingLevel', { default: 3, converter: convert.toNumber.fromString });
}
