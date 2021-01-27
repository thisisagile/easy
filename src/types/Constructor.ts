import { isFunction } from './Is';

export type Constructor<T = unknown> = { new (...args: any[]): T };

export const toName = (subject: unknown, postfix = ''): string => subject?.constructor.name?.replace(postfix, '').toLowerCase() ?? '';

export type Get<T = unknown, Param = unknown> = T | ((...params: Param[]) => T);
export type Predicate<Param> = Get<boolean, Param>;

export const ofGet = <T, Param>(g: Get<T, Param>, ...params: Param[]): T => (isFunction(g) ? g(...params) : g);
export const ifGet = <T>(pred: Get<unknown>, valid: Get<T>, invalid: Get<T>): T => (ofGet(pred) ? ofGet(valid) : ofGet(invalid));

export type GetProperty<T, U> = keyof T | ((t: T) => U);
export const ofProperty = <T, U>(t: T, p: GetProperty<T, U>): U => (isFunction(p) ? p(t) : ((t[p] as unknown) as U));
