import { Collection, convert } from '../../src';
import { DevDatabase } from './DevTable';

export class DevCollection extends Collection {
  readonly db = DevDatabase.DevDB;
  readonly id = this.prop('Id', { dflt: 42 });
  readonly name = this.prop('Name');
  readonly language = this.prop('Language', { dflt: 'TypeScript' });
  readonly level = this.prop('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}
