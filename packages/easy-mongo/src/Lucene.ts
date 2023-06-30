import { entries, Func, ifDefined, isFunction, on, OneOrMore, Optional, toArray, toList } from "@thisisagile/easy";
import { toMongoType } from "./Utils";

type FuzzyOptions = {
  maxEdits: number;
  prefixLength: number;
  maxExpansions: number;
};

export type Operator = Func<Optional<object>, string>;
export type Clause = object | Operator;
export type Clauses = Record<string, Clause>;

type Compound = {
  must: OneOrMore<Clauses>;
  should: OneOrMore<Clauses>;
  mustNot: OneOrMore<Clauses>;
  filter: OneOrMore<Clauses>;
};

export const lucene = {
  clause: (c: Clauses) => entries(c).reduce((res, [k, v]) => res.add(isFunction(v) ? v(k) : v), toList()),
  clauses: (cs: OneOrMore<Clauses>) => toArray(cs).flatMap(c => lucene.clause(c)),
  search: (c: Partial<Compound>, index?: string) => ({
    $search: {
      ...ifDefined(index, { index }),
      compound: entries(c).reduce((res, [k, v]) => on(res, r => (r[k] = lucene.clauses(v))), {} as any)
    }
  }),
  fuzzy:
    (value?: OneOrMore<unknown>, fuzzy: Partial<FuzzyOptions> ={}): Operator =>
      (path: string ) =>
        ifDefined(value, v => ({
          text: {
            path: { wildcard: '*' },
            query: v,
            ...ifDefined(fuzzy, { fuzzy })
          }
        })),
  text:
    (value?: OneOrMore<unknown>, fuzzy?: Partial<FuzzyOptions>): Operator =>
      (path: string ) =>
        ifDefined(value, v => ({
          text: {
            path,
            query: v,
            ...ifDefined(fuzzy, { fuzzy })
          }
        })),
  lt:
    (value: unknown): Operator =>
      (path: string) =>
        ifDefined(value, lt => ({ range: { path, lt } })),
  lte:
    (value: unknown): Operator =>
      (path: string) =>
        ifDefined(value, lte => ({ range: { path, lte } })),
  gt:
    (value: unknown): Operator =>
      (path: string) =>
        ifDefined(value, gt => ({ range: { path, gt } })),
  gte:
    (value: unknown): Operator =>
      (path: string) =>
        ifDefined(value, gte => ({ range: { path, gte } })),
  after: (date: unknown): Operator => lucene.gte(toMongoType(date)),
  before: (date: unknown): Operator => lucene.lt(toMongoType(date)),
  between:
    (after: unknown, before: unknown): Operator =>
      (path: string) => ({
        range: {
          path,
          gte: toMongoType(after),
          lt: toMongoType(before)
        }
      })
};
