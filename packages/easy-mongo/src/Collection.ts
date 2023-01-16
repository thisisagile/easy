import {
  asString,
  Condition,
  Database,
  Field,
  Get,
  Json,
  LogicalCondition,
  MapOptions,
  Mapper,
  mappings,
  ofGet,
  PropertyOptions,
  Sort,
  SortDirection,
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

  where = (...conditions: Get<Condition, this>[]): Json =>
    new LogicalCondition(
      'and',
      conditions.map(c => ofGet(c, this))
    ).toJSON();

  match = (condition: Get<Condition | LogicalCondition, this>): Json => ({ $match: ofGet(condition, this).toJSON() });

  group = (...conditions: Get<Condition, this>[]): Json =>
    new LogicalCondition(
      'group',
      conditions.map(c => ofGet(c, this))
    ).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);

  search = (key: Text): Field => this.map.field(asString(key));

  sort = (...conditions: Sort[]): Record<string, SortDirection> =>
    conditions.reduce((cs: any, c) => {
      cs[c.key] = c.value;
      return cs;
    }, {});

  out(to: Json = {}): Json {
    return toMongoType(super.out(to));
  }
}
