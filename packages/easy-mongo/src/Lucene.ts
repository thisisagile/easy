import {ifDefined, OneOrMore, toArray} from "@thisisagile/easy";
import {toMongoType} from "./Utils";

type FuzzyOptions = {
    maxEdits: number,
    prefixLength: number,
    maxExpansions: number
}

export const lucene = {
    // operators: {
    //     must:
    //     should:
    //     filter:
    // },
    operations: {
        text: (value?: OneOrMore<unknown>, fuzzy?: Partial<FuzzyOptions>) => (path: string) => ifDefined(value, v => ({
            text: {
                path,
                query: toArray(v), ...ifDefined(fuzzy, {fuzzy})
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
    // compound: ()
}