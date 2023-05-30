import { ArrayLike } from '@thisisagile/easy';

export const isDefined = <T = unknown>(o?: T): boolean => o !== undefined && o !== null;

export const isNumber = (o?: unknown): o is number => isDefined(o) && typeof o === 'number' && !Number.isNaN(o);
export const isFunction = (o?: unknown): o is (...params: unknown[]) => unknown => isDefined(o) && typeof o === 'function';

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => isDefined(t) && properties.every(p => isDefined((t as T)[p]));
export const isAn = isA;

export const isArray = <T = any>(o?: unknown): o is Array<T> => isDefined(o) && o instanceof Array;
export const isObject = (o?: unknown): o is Record<string, unknown> => o != null && (typeof o === 'object' || typeof o === 'function') && !isArray(o);

export const asJson = (a?: unknown): any => ((a as any)?.toJSON ? (a as any).toJSON() : isObject(a) ? a : undefined);
export const asString = (a?: unknown): string => (a as any)?.toString();

export const asNumber = (num: unknown, alt?: number | (() => number)): number => {
  const n = parseInt(asString(num));
  return isNumber(n) ? n : isFunction(alt) ? alt() : isNumber(alt) ? alt : NaN;
};

export const toArray = <T>(...items: ArrayLike<T>): T[] =>
  items.length > 1 ? (items as T[]) : isArray(items[0]) ? items[0] : isDefined(items[0]) ? [items[0]] : [];
