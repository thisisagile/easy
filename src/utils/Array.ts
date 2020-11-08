import { isArray, isDefined } from "../types";

export const toArray = <T>(...items: (T | T[])[]): T[] =>
  (items.length > 1) ? items as T[] : isArray(items[0]) ? items[0] : isDefined(items[0]) ? [items[0]] : [];

export const toReduceDefined = <T>(ts: T[], condition: boolean, t: T): T[] => condition ? ts.concat(t) : ts;

export class List<T> extends Array<T> {

}

export const array = <T>(...items: (T | T[])[]): List<T> => new Array<T>(...toArray(...items));
export const list = <T>(...items: (T | T[])[]): List<T> => new List<T>(...toArray(...items));
