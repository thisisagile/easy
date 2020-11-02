import { isDefined } from "../types";

export const toArray = <T>(...items: (T | T[])[]): T[] => {
  if (items.length > 1) return items as T[];
  if (items[0] instanceof Array) return items[0];
  return isDefined(items[0]) ? [items[0]] : [];
};
