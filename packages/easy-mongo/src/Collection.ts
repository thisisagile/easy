import { Condition, Database, Field, Json, LogicalCondition, MapOptions, Mapper, mappings, PropertyOptions, toCondition, toUuid } from '@thisisagile/easy';
import { convert } from './Utils';

export class Collection extends Mapper {
  protected readonly map = {
    ...mappings,
    field: <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(name, options),
  };

  constructor(readonly db: Database = Database.Default, options: MapOptions = { startFrom: 'source' }) {
    super(options);
  }

  readonly id = this.map.field('id', { dflt: toUuid });

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);

  out(to: Json = {}): Json {
    return convert(super.out(to));
  }
}
