import { Filter, FindOptions } from './MongoProvider';
import { Get, Id, ifDefined, isFunction, isPresent, isString, on, Optional, PartialRecord } from '@thisisagile/easy';
import { toMongoType } from './Utils';

export const asc = 1;
export const desc = -1;
export type Accumulators = '$sum' | '$count' | '$avg' | '$first' | '$last' | '$min' | '$max';
export type Accumulator = PartialRecord<Accumulators, Filter>;

export const stages = {
  decode: {
    fields: (f: Filter) => Object.entries(f).reduce((res, [k, v]) => on(res, r => (r[k] = isFunction(v) ? v(k) : v)), {} as any),
    id: (f: Filter | string) => (isString(f) ? f : Object.entries(f).map(([k, v]) => (isFunction(v) ? v(k) : v))[0]),
  },
  match: {
    match: (f: Record<string, Get<Filter, string>>) => ({ $match: stages.decode.fields(f) }),
    gt: (value: Filter) => ({ $gt: value }),
    gte: (value: Filter) => ({ $gte: value }),
    lt: (value: Filter) => ({ $lt: value }),
    lte: (value: Filter) => ({ $lte: value }),
    after: (date: unknown) => stages.match.gte(toMongoType(date)),
    before: (date: unknown) => stages.match.lt(toMongoType(date)),
  },
  sort: {
    sort: ($sort: Record<string, typeof asc | typeof desc>): Optional<Filter> => (isPresent($sort) ? { $sort } : undefined),
    asc: (key: string) => stages.sort.sort({ [key]: asc }),
    desc: (key: string) => stages.sort.sort({ [key]: desc }),
  },
  group: {
    group: (fields: Record<string, Accumulator>) => ({
      by: (by: Filter) => ({ $group: Object.assign({ _id: stages.decode.id(by) }, stages.decode.fields(fields)) }),
    }),
    date:
      (format = '%Y-%m-%d') =>
      (key: string) => ({ $dateToString: { date: `$${key}`, format } }),
    count: (): Accumulator => ({ $count: {} }),
    sum: (from?: string): Accumulator => ({ $sum: `$${from}` }),
    avg: (from?: string) => ({ $avg: `$${from}` }),
    first: (from?: string): Accumulator => ({ $first: `$${from}` }),
    last: (from?: string): Accumulator => ({ $last: `$${from}` }),
    min: (from?: string): Accumulator => ({ $min: `$${from}` }),
    max: (from?: string): Accumulator => ({ $max: `$${from}` }),
  },
  search: {
    search: (f: Record<string, Get<Filter, string>>) => ({ $search: stages.decode.id(f) }),
    auto: (value?: Id) => (key: string) => ({ autocomplete: { path: key, query: [value] } }),
  },
  skip: {
    skip: ({ skip: $skip }: FindOptions): Optional<Filter> => ifDefined($skip, { $skip }),
    take: ({ take: $limit }: FindOptions): Optional<Filter> => ifDefined($limit, { $limit }),
  },
};
