import { ifDefined, isPresent, Optional } from '@thisisagile/easy';
import { Filter, FindOptions } from './MongoProvider';
import { toMongoType } from './Utils';

export const asc = 1;
export const desc = -1;

export const aggregations = {
  gt: (key: string, value: Filter) => ({ [key]: { $gt: value } }),
  gte: (key: string, value: Filter) => ({ [key]: { $gte: value } }),
  lt: (key: string, value: Filter) => ({ [key]: { $lt: value } }),
  lte: (key: string, value: Filter) => ({ [key]: { $lte: value } }),
  match: (f: Filter) => ({ $match: f }),
  id: (id: Filter) => aggregations.match({ id }),
  eq: (key: string, value: Filter) => aggregations.match({ [key]: value }),
  after: (key: string, date: unknown) => aggregations.match(aggregations.gte(key, toMongoType(date))),
  before: (key: string, date: unknown) => aggregations.match(aggregations.lt(key, toMongoType(date))),
  sum: (to: string, from: string = to) => ({ [to]: { $sum: `$${from}` } }),
  count: (to = 'count') => ({ [to]: { $count: {} } }),
  groupBy: (by: Filter) => ({
    and: (...fs: Filter[]) => ({ $group: Object.assign({ _id: by }, ...fs) }),
  }),
  skip: ({ skip: $skip }: FindOptions): Optional<Filter> => ifDefined($skip, { $skip }),
  take: ({ take: $limit }: FindOptions): Optional<Filter> => ifDefined($limit, { $limit }),
  sort: ($sort: Record<string, typeof asc | typeof desc>): Optional<Filter> => (isPresent($sort) ? { $sort } : undefined),
  asc: (key: string) => aggregations.sort({ [key]: asc }),
  desc: (key: string) => aggregations.sort({ [key]: desc }),
  date: (key: string, format = '%Y-%m-%d') => ({ $dateToString: { date: `$${key}`, format } }),
};
