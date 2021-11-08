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
import { MongoProvider } from './MongoProvider';

export class Collection extends Mapper {
  protected readonly map = {
    ...mappings,
    field: <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(name, options),
  };
  readonly id = this.map.field('id', { dflt: toUuid });

  constructor(options: MapOptions = { startFrom: 'source' }) {
    super(options);
  }

  get db(): Database {
    return Database.Default;
  }

  get provider(): MongoProvider {
    return new MongoProvider(this);
  }

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();

  match = (...conditions: Condition[]): Json => new LogicalCondition('match', conditions).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);

  search = (key: Text): Field => this.map.field(asString(key));

  out(to: Json = {}): Json {
    return toMongoType(super.out(to));
  }
}
