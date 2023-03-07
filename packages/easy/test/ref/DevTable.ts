import { convert, Database, DefaultProvider, MapOptions, Table } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database('DevDB', DefaultProvider);
}

export class DevTable extends Table {
  readonly id = this.map.column('Id', { dflt: 42 });
  readonly name = this.map.column('Name');
  readonly language = this.map.column('Language', { dflt: 'TypeScript' });
  readonly level = this.map.column('CodingLevel', { dflt: '3', convert: convert.toNumber.fromString });

  constructor(options: MapOptions = { startFrom: 'scratch' }) {
    super(options);
  }

  get db(): Database {
    return DevDatabase.DevDB;
  }
}
