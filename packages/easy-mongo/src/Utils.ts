import { choose, DateTime, isArray, isIsoDateString, isObject, Json, meta } from '@thisisagile/easy';

export const convert = (input: unknown): Json => {
  return choose<any, any>(input)
    .case(
      v => isIsoDateString(v),
      (v: any) => new DateTime(v).toDate()
    )
    .case(
      v => isArray(v),
      (v: any) => v.map((i: any) => convert(i))
    )
    .case(
      v => isObject(v),
      (v: any) =>
        Object.fromEntries(
          meta(v)
            .entries()
            .map(([k, i]) => [k, convert(i)])
        )
    )
    .else(input);
};
