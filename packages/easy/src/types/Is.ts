export const isDefined = <T = unknown>(o?: T): o is NonNullable<T> => o !== undefined && o !== null;

export const isUndefined = (v?: unknown): v is never => v === undefined || v === null;

export const isEmpty = (o?: unknown): boolean => o === '' || o === null || o === undefined || (isArray(o) && o.length === 0);

export const isNotEmpty = <T = unknown>(o?: unknown): o is NonNullable<T> => o !== '' && o !== null && o !== undefined && (!isArray(o) || o.length > 0);

export const isString = (o?: unknown): o is string => o instanceof String || typeof o === 'string';

export const isIsoDateString = (o?: unknown): o is string =>
  isString(o) && /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/.test(o);

export const isBoolean = (o?: unknown): o is boolean => isDefined(o) && typeof o === 'boolean';

export const isTrue = (o?: unknown): o is true => (isFunction(o) ? isTrue(o()) : isBoolean(o) ? o : !!o);

export const isNumber = (o?: unknown): o is number => isDefined(o) && typeof o === 'number' && !Number.isNaN(o);

export const isObject = (o?: unknown): o is Record<string, unknown> => o != null && typeof o === 'object' && !isArray(o);

export const isEmptyObject = (o?: unknown): boolean => isObject(o) && Object.getOwnPropertyNames(o).length === 0;

export const isFunction = (o?: unknown): o is (...params: unknown[]) => unknown => isDefined(o) && typeof o === 'function';

export const isArray = <T = any>(o?: unknown): o is Array<T> => isDefined(o) && o instanceof Array;

export const isIn = (o: unknown, values: unknown[]): boolean => isArray(values) && values.some(v => v === o);

export const isIntersecting = (o?: unknown[], values?: unknown[]): boolean => isArray(o) && isArray(values) && o.some(ov => isIn(ov, values));

export const isError = (e: unknown): e is Error => isDefined(e) && e instanceof Error;

export const isNotPresent = (...os: unknown[]): boolean =>
  os.some(
    o =>
      o === null ||
      o === undefined ||
      o === '' ||
      (o instanceof Array && o.length === 0) ||
      (typeof o === 'object' && Object.getOwnPropertyNames(o).length === 0)
  );

export const isPresent = (...os: unknown[]): boolean => !isNotPresent(...os);
