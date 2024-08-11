import { Filter, FindOptions } from './MongoProvider';
import {
  asNumber,
  asString,
  Currency,
  Get,
  Id,
  ifDefined,
  ifNotEmpty,
  isDefined,
  isPresent,
  isPrimitive,
  isString,
  meta,
  ofGet,
  on,
  OneOrMore,
  Optional,
  PartialRecord,
  toArray,
  use,
} from '@thisisagile/easy';
import { toMongoType } from './Utils';

export const asc = 1;
export const desc = -1;
export type Accumulators = '$sum' | '$count' | '$multiply' | '$avg' | '$first' | '$last' | '$min' | '$max' | '$push' | '$addToSet' | '$size';
export type Accumulator = PartialRecord<Accumulators, Filter>;

export class FilterBuilder<Options> {
  constructor(private filters: { [K in keyof Options]: (v: Options[K]) => Filter }) {}

  from = (q: Partial<Options> = {}): Filter =>
    stages.match.match(
      meta(q)
        .entries()
        .reduce((acc, [key, value]) => ({ ...acc, ...ifDefined(this.filters[key as keyof Options], f => f(value as Options[keyof Options])) }), {})
    );
}

type Sort = Record<string, typeof asc | typeof desc>;

export class SortBuilder {
  constructor(private sorts: Record<string, Sort>) {}

  get keys(): string[] {
    return Object.keys(this.sorts);
  }

  from = (
    s: {
      s?: string;
    } = {},
    alt?: string
  ): Optional<Filter> => stages.sort.sort(this.sorts[s?.s ?? ''] ?? this.sorts[alt ?? '']);
}

export class IncludeBuilder {
  constructor(private includes: Record<string, (string | Record<string, 1>)[]>) {}

  get keys(): string[] {
    return Object.keys(this.includes);
  }

  from = (
    i: {
      i?: string;
    } = {},
    alt?: string
  ): Optional<Filter> => stages.project.include(...(this.includes[i?.i ?? ''] ?? this.includes[alt ?? ''] ?? []));
}

const escapeRegex = (s: string) => s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

export const stages = {
  root: '$$ROOT',
  current: '$$CURRENT',
  id: '_id',
  decode: {
    object: (f: Filter) => use(Object.entries(f)[0], ([k, v]) => ofGet(v, k)),
    fields: (f: Filter) => Object.entries(f).reduce((res, [k, v]) => on(res, r => ifDefined(ofGet(v, k), nv => (r[k] = nv))), {} as any),
    fieldsArrays: (f: Filter) => Object.entries(f).reduce((res, [k, v]) => on(res, r => (r[k] = use(toArray(v), vs => vs.map(v => ofGet(v, k))))), {} as any),
    id: (f: Filter | string) => (isString(f) ? `$${asString(f)}` : isPrimitive(f) ? f : Object.entries(f).map(([k, v]) => ofGet(v, k))[0]),
  },
  match: {
    match: (f: Record<string, Get<Optional<Filter>, string>>) => ({ $match: stages.decode.fields(f) }),
    filter: <Options>(filters: { [K in keyof Options]: (v: Options[K]) => Filter }) => new FilterBuilder<Options>(filters),
    or: (...filters: Filter[]) => ({ $or: toArray(filters).map(f => stages.decode.object(f)) }),
    gt: (value: Filter) => ({ $gt: value }),
    gte: (value: Filter) => ({ $gte: value }),
    lt: (value: Filter) => ({ $lt: value }),
    lte: (value: Filter) => ({ $lte: value }),
    isIn: (value: OneOrMore<unknown>, separator = ',') => ({ $in: isString(value) ? value.split(separator) : value }),
    notIn: (value: OneOrMore<unknown>, separator = ',') => ({ $nin: isString(value) ? value.split(separator) : value }),
    after: (date: unknown) => stages.match.gte(toMongoType(date)),
    before: (date: unknown) => stages.match.lt(toMongoType(date)),
    anywhere: (q: string) => ({ $regex: escapeRegex(q), $options: 'i' }),
    money: (currency: Currency, value: Filter) => (key: string) => ({
      [`${key}.currency`]: currency.id,
      ...stages.decode.fields({ [`${key}.value`]: value }),
    }),
  },
  sort: {
    sort: ($sort: Sort) => (isPresent($sort) ? { $sort } : undefined),
    sorter: (sorts: Record<string, Sort>) => new SortBuilder(sorts),
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
    sum: (from?: string): Accumulator => (isDefined(from) ? { $sum: `$${from}` } : { $sum: 1 }),
    avg: (from?: string) => ({ $avg: `$${from}` }),
    multiply: (...multiply: string[]) => ({ $multiply: multiply.map(m => `$${m}`) }),
    first: (from?: string): Accumulator => ({ $first: `$${from}` }),
    last: (from?: string): Accumulator => ({ $last: `$${from}` }),
    min: (from?: string): Accumulator => ({ $min: `$${from}` }),
    max: (from?: string): Accumulator => ({ $max: `$${from}` }),
    addToSet: (from?: string): Accumulator => ({ $addToSet: `$${from}` }),
    push: (from = '$ROOT'): Accumulator => ({ $push: `$${from}` }),
    size: (from?: string): Accumulator => ({ $size: `$${from}` }),
  },
  search: {
    search: (f: Record<string, Get<Filter, string>>) => ifDefined(stages.decode.id(f), $search => ({ $search })),
    auto: (value?: Id) => (key: string) => ifDefined(value, v => ({ autocomplete: { path: key, query: [v] } })),
    fuzzy:
      (value?: string, maxEdits = 1) =>
      (key?: string) =>
        ifDefined(value, v => ({
          text: {
            query: v,
            path: key === 'wildcard' ? { wildcard: '*' } : key,
            fuzzy: { maxEdits },
          },
        })),
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
    include: (...includes: (string | Record<string, 1 | string>)[]): Optional<Filter> =>
      ifNotEmpty(includes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? { [b]: 1 } : b) }), {}) })),
    exclude: (...excludes: (string | Record<string, 0>)[]): Optional<Filter> =>
      ifNotEmpty(excludes, es => ({ $project: es.reduce((a: Filter, b: Filter) => ({ ...a, ...(isString(b) ? { [b]: 0 } : b) }), {}) })),
    includes: (includes: Record<string, (string | Record<string, 1>)[]>) => new IncludeBuilder(includes),
    project: (project?: Filter) => ifDefined(project, $project => ({ $project })),
  },
  replaceWith: {
    replaceWith: (f?: Filter): Optional<Filter> => ifDefined(f, { $replaceWith: f }),
    merge: (...objects: Filter[]): Optional<Filter> => ifNotEmpty(objects, os => ({ $mergeObjects: os })),
    rootAnd: (...objects: Filter[]): Optional<Filter> => stages.replaceWith.merge(stages.root, ...objects),
    currentAnd: (...objects: Filter[]): Optional<Filter> => stages.replaceWith.merge(stages.current, ...objects),
    reroot: (prop: string): Filter => ({ $replaceRoot: { newRoot: `$${prop}` } }),
    concat: (...props: string[]): Optional<Filter> => ifNotEmpty(props, ps => ({ $concatArrays: ps.map(p => `$${p}`) })),
  },
  facet: {
    facet: (f: Record<string, OneOrMore<Get<Optional<Filter>, string>>>) => ({ $facet: stages.decode.fieldsArrays(f) }),
    unwind: (from?: string) => (f?: string) => ({ $unwind: `$${from ?? f}` }),
    count: (from?: string) => (f?: string) => ({ $sortByCount: `$${from ?? f}` }),
    data: () => [],
  },
  unwind: {
    unwind: (prop?: string) => ({ $unwind: `$${prop}` }),
  },
};
