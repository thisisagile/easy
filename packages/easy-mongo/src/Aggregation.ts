import { Id, ifDefined, isPresent, Optional } from '@thisisagile/easy';
import { Filter, FindOptions } from './MongoProvider';

export const asc = 1;
export const desc = -1;

export const aggregation = {
  match: (f: Filter) => ({ $match: f }),
  id: (id: Id) => aggregation.match({ id }),
  eq: (key: string, value: Id) => aggregation.match({ [key]: value }),
  sum: (to: string, from: string = to) => ({ [to]: { $sum: `$${from}` } }),
  group: (id: Id, g: Filter) => ({ $group: { _id: id, ...g } }),
  skip: ({ skip: $skip }: FindOptions): Optional<Filter> => ifDefined($skip, { $skip }),
  take: ({ take: $limit }: FindOptions): Optional<Filter> => ifDefined($limit, { $limit }),
  sort: ($sort: Record<string, typeof asc | typeof desc>): Optional<Filter> => (isPresent($sort) ? { $sort } : undefined),
  asc: (key: string) => aggregation.sort({ [key]: asc }),
};
