import { DevDatabase } from '@thisisagile/easy/test/ref';
import { Collection, convert } from '@thisisagile/easy';

export class DevCollection extends Collection {
  readonly db = DevDatabase.DevDB;
  readonly id = this.map.field('Id', { dflt: 42 });
  readonly name = this.map.field('Name');
  readonly language = this.map.field('Language', { dflt: 'TypeScript' });
  readonly level = this.map.field('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}
