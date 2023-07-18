import { isArray, isDefined } from "./Is";
import { on, use } from "./Constructor";

export type OneOrMore<T> = T | Array<T>;
export type ArrayLike<T> = OneOrMore<T>[];

export const toArray = <T>(...items: ArrayLike<T>): T[] =>
  items.length > 1 ? (items as T[]) : isArray(items[0]) ? items[0] : isDefined(items[0]) ? [items[0]] : [];

export const toObject = <T>(key: keyof T, ...items: ArrayLike<T>): Record<string | number | symbol, T> =>
  toArray(...items).reduce((o: any, i) => {
    o[i[key]] = i;
    return o;
  }, {});

export const array = {
  merge: (first: any[] = [], second: any[] = [], firstKey = "id", secondKey = "id"): any[] =>
    first.map(f => ({
      ...f,
      ...second.find(s => isDefined(s[secondKey]) && isDefined(f[firstKey]) && s[secondKey] === f[firstKey])
    })),
  switch: <T>(items: T[] = [], item: T): T[] => use([...items], res => {
    on(res.indexOf(item), i => (i !== -1 ? res.splice(i, 1) : res.push(item)));
    return res;
  }),
  splitIn: <T>(items: T[] = [], length = 2): T[][] => {
    const res: T[][] = Array.from({ length }, () => []);
    items.forEach((i, index) => res[index % length].push(i));
    return res;
  }
};

// export const objectify = <T>(items: T[], f: (a: any, p: T) => void): any => items.reduce((acc: any, p: T) => on(acc, a => f(a, p)), {});
