import {
  choose,
  Condition,
  Database,
  DateTime,
  Field,
  isArray,
  isIsoDateString,
  isObject,
  Json,
  LogicalCondition,
  MapOptions,
  Mapper,
  mappings,
  meta,
  PropertyOptions,
  toCondition,
  toUuid,
} from '@thisisagile/easy';

const convert = (input: any): Json => {
  return choose<any, any>(input)
    .case(
      v => isIsoDateString(v),
      (v: any) => new DateTime(v).toDate()
    )
    .case(
      v => isArray(v),
      (v: any) => v.map((i: any) => convert(i))
    )
    .case(
      v => isObject(v),
      (v: any) =>
        Object.fromEntries(
          meta(v)
            .entries()
            .map(([k, i]) => [k, convert(i)])
        )
    )
    .else(input);
};

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
