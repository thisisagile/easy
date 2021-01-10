import { convert, Table } from '../../src';

export class DevTable extends Table {
  readonly id = this.col('Id', { default: 42 });
  readonly name = this.col('Name');
  readonly level = this.col('CodingLevel', { default: 3, converter: convert.toNumber.fromString });
}
