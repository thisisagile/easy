import { Collection, convert } from '../../src';
import { DevDatabase } from './DevTable';

export class DevCollection extends Collection {
  readonly db = DevDatabase.DevDB;
  readonly id = this.map.field('Id', { dflt: 42 });
  readonly name = this.map.field('Name');
  readonly language = this.map.field('Language', { dflt: 'TypeScript' });
  readonly level = this.map.field('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}
