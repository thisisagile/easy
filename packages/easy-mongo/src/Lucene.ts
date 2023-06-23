import {ifDefined, isArray, OneOrMore, toArray} from "@thisisagile/easy";
import {toMongoType} from "./Utils";

type FuzzyOptions = {
    maxEdits: number,
    prefixLength: number,
    maxExpansions: number
}

type Clause = Record<string, (path: string) => object | undefined>;

type Compound = {
    must?: OneOrMore<Clause>,
    mustNot?: OneOrMore<Clause>,
    should?: OneOrMore<Clause>,
    filter?: OneOrMore<Clause>
}

export const lucene = {
    operations: {
        clause: (cl: Clause) => Object.entries(cl).reduce((res, [k, v]) => v(k), {} as any),
        search: (cmp: Partial<Compound>) => ({
            $search: {
                compound: Object.entries(cmp).reduce((cp, [k, v]) => ({
                    ...cp,
                    [k]: isArray(v) ? toArray(v).map(i => lucene.operations.clause(i)) : lucene.operations.clause(v)
                }), {} as any)
            }
        }),
        text: (value?: OneOrMore<unknown>, fuzzy?: Partial<FuzzyOptions>) => (path: string) => ifDefined(value, v => ({
            text: {
                path,
                query: v,
                ...ifDefined(fuzzy, {fuzzy})
            }
        })),
        lt: (value: unknown) => (path: string) => ifDefined(value, lt => ({range: {path, lt}})),
        lte: (value: unknown) => (path: string) => ifDefined(value, lte => ({range: {path, lte}})),
        gt: (value: unknown) => (path: string) => ifDefined(value, gt => ({range: {path, gt}})),
        gte: (value: unknown) => (path: string) => ifDefined(value, gte => ({range: {path, gte}})),
        after: (date: unknown) => lucene.operations.gte(toMongoType(date)),
        before: (date: unknown) => lucene.operations.lt(toMongoType(date)),
        between: (after: unknown, before: unknown) => (path: string) => ({
            range: {
                path,
                gte: toMongoType(after),
                lt: toMongoType(before)
            }
        }),
    }
};
