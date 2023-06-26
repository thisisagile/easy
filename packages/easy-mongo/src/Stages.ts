import { Filter, FindOptions } from "./MongoProvider";
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
  meta,
  on,
  OneOrMore,
  Optional,
  PartialRecord,
  toArray,
  use
} from "@thisisagile/easy";
import { toMongoType } from "./Utils";

export const asc = 1;
export const desc = -1;
export type Accumulators = "$sum" | "$count" | "$avg" | "$first" | "$last" | "$min" | "$max" | "$push";
export type Accumulator = PartialRecord<Accumulators, Filter>;

class FilterBuilder<Options> {
  constructor(private filters: {[K in keyof Options]: (v: Options[K]) => Filter}) {
  }
  from = (q: Partial<Options> = {}): Filter =>
    stages.match.match(meta(q)
      .entries()
      .reduce((acc, [key, value]) => ({ ...acc, ...ifDefined(this.filters[key as keyof Options], f => f(value as Options[keyof Options])) }), {}));
}

const escapeRegex = (s: string) => s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

export const stages = {
  root: "$$ROOT",
  current: "$$CURRENT",
  id: "_id",
  decode: {
    fields: (f: Filter) => Object.entries(f).reduce((res, [k, v]) => on(res, r => ifDefined(isFunction(v) ? v(k) : v, nv => (r[k] = nv))), {} as any),
    fieldsArrays: (f: Filter) =>
      Object.entries(f).reduce((res, [k, v]) => on(res, r => (r[k] = use(toArray(v), vs => vs.map(v => (isFunction(v) ? v(k) : v))))), {} as any),
    id: (f: Filter | string) => (isString(f) ? `$${asString(f)}` : isPrimitive(f) ? f : Object.entries(f).map(([k, v]) => (isFunction(v) ? v(k) : v))[0])
  },
  match: {
    match: (f: Record<string, Get<Optional<Filter>, string>>) => ({ $match: stages.decode.fields(f) }),
    filter: <Options>(filters: {[K in keyof Options]: (v: Options[K]) => Filter}) => new FilterBuilder<Options>(filters),
    gt: (value: Filter) => ({ $gt: value }),
    gte: (value: Filter) => ({ $gte: value }),
    lt: (value: Filter) => ({ $lt: value }),
    lte: (value: Filter) => ({ $lte: value }),
    isIn: (value: OneOrMore<unknown>, separator = ",") => ({ $in: isString(value) ? value.split(separator) : value }),
    after: (date: unknown) => stages.match.gte(toMongoType(date)),
    before: (date: unknown) => stages.match.lt(toMongoType(date)),
    anywhere: (q: string) => ({ $regex: escapeRegex(q), $options: "i" })
  },
  sort: {
    sort: ($sort: Record<string, typeof asc | typeof desc>): Optional<Filter> => (isPresent($sort) ? { $sort } : undefined),
    asc: (key: string) => stages.sort.sort({ [key]: asc }),
    desc: (key: string) => stages.sort.sort({ [key]: desc })
  },
  group: {
    group: (fields: Record<string, Accumulator>) => ({
      by: (by: Filter) => ({ $group: Object.assign({ _id: stages.decode.id(by) }, stages.decode.fields(fields)) })
    }),
    date:
      (format = "%Y-%m-%d") =>
        (key: string) => ({ $dateToString: { date: `$${key}`, format } }),
    count: (): Accumulator => ({ $count: {} }),
    sum: (from?: string): Accumulator => ({ $sum: `$${from}` }),
    avg: (from?: string) => ({ $avg: `$${from}` }),
    first: (from?: string): Accumulator => ({ $first: `$${from}` }),
    last: (from?: string): Accumulator => ({ $last: `$${from}` }),
    min: (from?: string): Accumulator => ({ $min: `$${from}` }),
    max: (from?: string): Accumulator => ({ $max: `$${from}` }),
    push: (): Accumulator => ({ $push: "$$ROOT" })
  },
  search: {
    search: (f: Record<string, Get<Filter, string>>) => ifDefined(stages.decode.id(f), $search => ({ $search })),
    auto: (value?: Id) => (key: string) => ifDefined(value, v => ({ autocomplete: { path: key, query: [v] } })),
    fuzzy: (value?: string, maxEdits = 1) => (key?: string) => ifDefined(value, v => ({
      text: {
        query: v,
        path: key === "wildcard" ? { wildcard: "*" } : key,
        fuzzy: { maxEdits }
      }
    }))
  },
  set: {
    set: (f: Record<string, Get<Filter, string>>) => ({ $set: stages.decode.fields(f) }),
    score: () => ({ $meta: "searchScore" })
  },
  skip: {
    skip: (o: FindOptions = {}): Optional<Filter> => ifDefined(o.skip, { $skip: asNumber(o.skip) }),
    take: (o: FindOptions = {}): Optional<Filter> => ifDefined(o.take, { $limit: asNumber(o.take) })
  },
  project: {
    include: (...includes: (string | Record<string, 1>)[]): Optional<Filter> =>
      ifNotEmpty(includes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? { [b]: 1 } : b) }), {}) })),
    exclude: (...excludes: (string | Record<string, 0>)[]): Optional<Filter> =>
      ifNotEmpty(excludes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? { [b]: 0 } : b) }), {}) }))
  },
  replaceWith: {
    replaceWith: (f?: Filter): Optional<Filter> => ifDefined(f, { $replaceWith: f }),
    merge: (...objects: Filter[]): Optional<Filter> => ifNotEmpty(objects, os => ({ $mergeObjects: os })),
    rootAnd: (...objects: Filter[]): Optional<Filter> => stages.replaceWith.merge(stages.root, ...objects),
    currentAnd: (...objects: Filter[]): Optional<Filter> => stages.replaceWith.merge(stages.current, ...objects)
  },
  facet: {
    facet: (f: Record<string, OneOrMore<Get<Optional<Filter>, string>>>) => ({ $facet: stages.decode.fieldsArrays(f) }),
    unwind: (from?: string) => (f?: string) => ({ $unwind: `$${from ?? f}` }),
    count: (from?: string) => (f?: string) => ({ $sortByCount: `$${from ?? f}` }),
    data: () => []
  }
};
