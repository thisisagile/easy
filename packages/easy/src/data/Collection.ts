import { choose, MapOptions, Mapper, mappings, PropertyOptions } from '../utils';
import { Database } from '../data';
import { isIsoDateString, isObject, Json, meta, toUuid } from '../types';
import { Field } from './Field';
import { Condition, LogicalCondition, toCondition } from './Condition';
import { DateTime } from '../domain';

const convert = (input: any): Json => {
  return meta(input)
    .entries()
    .reduce((output: Json, [key, value]) => {
      output[key] = choose<any, any>(value)
        .case(
          v => isObject(v),
          (v: any) => convert(v)
        )
        .case(
          v => isIsoDateString(v),
          (v: any) => new DateTime(v).toDate()
        )
        .else(value);
      return output;
    }, {});
};

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

  readonly id = this.map.field('id', { dflt: toUuid });

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();

  google = (value: unknown): Condition => toCondition('$text', 'search', value);

  out(to: Json = {}): Json {
    return convert(super.out(to));
  }
}
