import { Database, DefaultProvider } from '@thisisagile/easy';
import { Collection } from '../../src';

export class TechCollection extends Collection {
  get db(): Database {
    return new Database('TechDB', DefaultProvider, { cluster: 'tech' });
  }
  readonly id = this.map.field('Id', { dflt: 42 });
}
