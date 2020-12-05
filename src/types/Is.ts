import { Constructor } from './Constructor';

export const isDefined = (o?: unknown): boolean => o !== undefined && o !== null;

export const isEmpty = (o?: unknown): boolean => o === '' || o === null || o === undefined;

export const isNotEmpty = (o?: unknown): boolean => o !== '' && o !== null && o !== undefined;

export const isString = (o?: unknown): o is string => o instanceof String || typeof o === 'string';

export const isObject = (o?: unknown): o is Object => o != null && (typeof o === 'object' || typeof o === 'function') && !isArray(o);

export const isEmptyObject = (o?: unknown): boolean => isObject(o) && Object.getOwnPropertyNames(o).length === 0;

export const isFunction = (o?: unknown): o is (...params: unknown[]) => unknown => isDefined(o) && typeof o === 'function';

export const isArray = <T = any>(o?: unknown): o is Array<T> => isDefined(o) && o instanceof Array;

export const isInstance = <T>(ctor: Constructor<T>, o?: unknown): o is T => isFunction(ctor) && o instanceof ctor;

export const isIn = (o: unknown, values: unknown[]): boolean => isArray(values) && values.some(v => v === o);

export const isPrimitive = (o?: unknown): boolean => (o !== null) && !isObject(o) && !isFunction(o) && !isArray(o);

