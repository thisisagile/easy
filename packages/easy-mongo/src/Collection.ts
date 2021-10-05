import {
  asString,
  Condition,
  Database,
  Field,
  Json,
  LogicalCondition,
  MapOptions,
  Mapper,
  mappings,
  PropertyOptions,
  Text,
  toCondition,
  toUuid,
} from '@thisisagile/easy';
import { toMongoType } from './Utils';

export class Collection extends Mapper {
  protected readonly map = {
    ...mappings,
    field: <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(name, options),
  };

  constructor(options: MapOptions = { startFrom: 'source' }) {
    super(options);
  }

  get db(): Database {
    return Database.Default;
  }

  readonly id = this.map.field('id', { dflt: toUuid });

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);

  search = (key: Text): Field => this.map.field(asString(key));

  out(to: Json = {}): Json {
    return toMongoType(super.out(to));
  }
}
