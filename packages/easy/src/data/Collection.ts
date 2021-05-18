import { MapOptions, Mapper, mappings, PropertyOptions } from '../utils';
import { Database } from '../data';
import { Json, toUuid } from '../types';
import { Field } from './Field';
import { Condition, LogicalCondition, toCondition } from './Condition';

export class Collection extends Mapper {
  protected readonly map = {
    ...mappings,
    field: <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(name, options),
  };

  constructor(readonly db: Database = Database.Default, options: MapOptions = { startFrom: 'source' }) {
    super(options);
  }

  /**
   * @deprecated Deprecated since version 6.2. Please use map.field instead.
   */
  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Field => this.map.field(name, options);

  readonly id = this.prop('id', { dflt: toUuid });

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);
}
