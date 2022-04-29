import { choose, DateTime, isArray, isDate, isIsoDateString, isObject, Json, meta } from '@thisisagile/easy';

export const toMongoType = (input: unknown): Json =>
  choose(input)
  .type(isIsoDateString, i => new DateTime(i).toDate() as any)
  .type(isArray, a => a.map((i: any) => toMongoType(i)))
  .type(isDate, d => d)
  .type(isObject, o => Object.fromEntries(meta(o).entries().map(([k, i]) => [k, toMongoType(i)])))
  .else(input);
