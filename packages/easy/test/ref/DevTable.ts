import * as Database from '../../src/data/Database';
import { convert, MapOptions, Table } from '../../src';

export const DevDatabase = {
  DevDB: Database.create('DevDB', Database.DefaultProvider, { cluster: 'dev' }),
};

export class DevTable extends Table {
  readonly id = this.map.column('Id', { dflt: 42 });
  readonly name = this.map.column('Name');
  readonly language = this.map.column('Language', { dflt: 'TypeScript' });
  readonly level = this.map.column('CodingLevel', { dflt: '3', convert: convert.toNumber.fromString });

  constructor(options: MapOptions = { startFrom: 'scratch' }) {
    super(options);
  }

  get db(): Database.Enum {
    return DevDatabase.DevDB;
  }
}
