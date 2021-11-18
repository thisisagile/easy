import { choose, DateTime, isArray, isDate, isIsoDateString, isObject, Json, meta } from '@thisisagile/easy';

export const toMongoType = (input: unknown): Json => {
  return choose<any, any>(input)
    .case(
      v => isIsoDateString(v),
      (v: any) => new DateTime(v).toDate()
    )
    .case(
      v => isArray(v),
      (v: any) => v.map((i: any) => toMongoType(i))
    )
    .case(
      v => isObject(v) && !isDate(v),
      (v: any) =>
        Object.fromEntries(
          meta(v)
            .entries()
            .map(([k, i]) => [k, toMongoType(i)])
        )
    )
    .else(input);
};
