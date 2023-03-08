import { ifDefined, isPresent, Optional } from '@thisisagile/easy';
import { Filter, FindOptions } from './MongoProvider';
import { toMongoType } from './Utils';

export const asc = 1;
export const desc = -1;

export const aggregation = {
  match: (f: Filter) => ({ $match: f }),
  id: (id: Filter) => aggregation.match({ id }),
  eq: (key: string, value: Filter) => aggregation.match({ [key]: value }),
  gt: (key: string, value: Filter) => ({ [key]: { $gt: value } }),
  gte: (key: string, value: Filter) => ({ [key]: { $gte: value } }),
  lt: (key: string, value: Filter) => ({ [key]: { $lt: value } }),
  lte: (key: string, value: Filter) => ({ [key]: { $lte: value } }),
  sum: (to: string, from: string = to) => ({ [to]: { $sum: `$${from}` } }),
  count: (to = 'count') => ({ [to]: { $count: {} } }),
  after: (key: string, date: unknown) => aggregation.match(aggregation.gt(key, toMongoType(date))),
  group: (by: Filter, ...fs: Filter[]) => ({ $group: Object.assign({ _id: by }, ...fs) }),
  skip: ({ skip: $skip }: FindOptions): Optional<Filter> => ifDefined($skip, { $skip }),
  take: ({ take: $limit }: FindOptions): Optional<Filter> => ifDefined($limit, { $limit }),
  sort: ($sort: Record<string, typeof asc | typeof desc>): Optional<Filter> => (isPresent($sort) ? { $sort } : undefined),
  asc: (key: string) => aggregation.sort({ [key]: asc }),
  desc: (key: string) => aggregation.sort({ [key]: desc }),
  date: (key: string, format = '%Y-%m-%d') => ({ $dateToString: { date: `$${key}`, format } }),
};
