import * as Database from '@thisisagile/easy/Database';
import { Collection } from '../../src';

export class TechCollection extends Collection {
  get db(): Database.Enum {
    return Database.create('TechDB', Database.DefaultProvider, { cluster: 'tech' });
  }
  readonly id = this.map.field('Id', { dflt: 42 });
}
