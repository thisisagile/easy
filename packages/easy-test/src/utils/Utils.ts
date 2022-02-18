import { Get, isNumber, ofGet, tryTo } from '@thisisagile/easy';

export const isDefined = (o?: unknown): boolean => o !== undefined && o !== null;

export const isFunction = (o?: unknown): o is (...params: unknown[]) => unknown => isDefined(o) && typeof o === 'function';

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => isDefined(t) && properties.every(p => isDefined((t as T)[p]));
export const isAn = isA;

export const isArray = <T = any>(o?: unknown): o is Array<T> => isDefined(o) && o instanceof Array;
export const isObject = (o?: unknown): o is Record<string, unknown> => o != null && (typeof o === 'object' || typeof o === 'function') && !isArray(o);

export const asJson = (a?: unknown): any => ((a as any)?.toJSON ? (a as any).toJSON() : isObject(a) ? a : undefined);
export const asString = (a?: unknown): any => (a as any)?.toString();

export const asNumber = (n: unknown, alt?: Get<number>): number => tryTo(() => asString(n)).map(s => parseInt(s)).filter(n => isNumber(n)).or(ofGet(alt) ?? NaN);
