import { Filter, FindOptions } from './MongoProvider';
import {
  asNumber,
  asString,
  Get,
  Id,
  ifDefined,
    ifNotEmpty,
  isFunction,
  isPresent,
  isPrimitive,
  isString,
  on,
  Optional,
  PartialRecord
} from '@thisisagile/easy';
import { toMongoType } from './Utils';

export const asc = 1;
export const desc = -1;
export type Accumulators = '$sum' | '$count' | '$avg' | '$first' | '$last' | '$min' | '$max' | '$push';
export type Accumulator = PartialRecord<Accumulators, Filter>;

const escapeRegex = (s: string) => s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

export const stages = {
  root: '$$ROOT',
  current: '$$CURRENT',
  decode: {
    fields: (f: Filter) => Object.entries(f).reduce((res, [k, v]) => on(res, r => ifDefined(isFunction(v) ? v(k) : v, nv => (r[k] = nv))), {} as any),
    id: (f: Filter | string) => (isString(f) ? `$${asString(f)}` : isPrimitive(f) ? f : Object.entries(f).map(([k, v]) => (isFunction(v) ? v(k) : v))[0]),
  },
  match: {
    match: (f: Record<string, Get<Optional<Filter>, string>>) => ({ $match: stages.decode.fields(f) }),
    gt: (value: Filter) => ({ $gt: value }),
    gte: (value: Filter) => ({ $gte: value }),
    lt: (value: Filter) => ({ $lt: value }),
    lte: (value: Filter) => ({ $lte: value }),
    array: (value: unknown[]) => ({ $in: value }),
    after: (date: unknown) => stages.match.gte(toMongoType(date)),
    before: (date: unknown) => stages.match.lt(toMongoType(date)),
    anywhere: (q: string) => ({ $regex: escapeRegex(q), $options: "i" })
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
    push: (): Accumulator => ({ $push: '$$ROOT' }),
  },
  search: {
    search: (f: Record<string, Get<Filter, string>>) => ({ $search: stages.decode.id(f) }),
    auto: (value?: Id) => (key: string) => ({ autocomplete: { path: key, query: [value] } }),
  },
  set: {
    set: (f: Record<string, Get<Filter, string>>) => ({ $set: stages.decode.fields(f) }),
    score: () => ({ $meta: 'searchScore' }),
  },
  skip: {
    skip: (o: FindOptions = {}): Optional<Filter> => ifDefined(o.skip, { $skip: asNumber(o.skip) }),
    take: (o: FindOptions = {}): Optional<Filter> => ifDefined(o.take, { $limit: asNumber(o.take) }),
  },
  project: {
    include: (...includes: (string | Record<string, 1>)[]): Optional<Filter> => ifNotEmpty(includes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? {[b]: 1} : b) }), {}) })),
    exclude: (...excludes: (string | Record<string, 0>)[]): Optional<Filter> => ifNotEmpty(excludes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? {[b]: 0} : b) }), {}) }))
  },
  replaceWith: {
    merge: (...objects: Filter[]): Optional<Filter> => ifNotEmpty(objects, os => ({ $replaceWith: { $mergeObjects: os }}))
  }
};
