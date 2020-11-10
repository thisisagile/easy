import { isFunction } from './Is';

export type Constructor<T> = { new (...args: any[]): T };

export type Get<T, Param = unknown> = T | ((...params: Param[]) => T);
export type Predicate<Param> = Get<boolean, Param>;
export const ofGet = <T, Param>(g: Get<T, Param>, ...params: Param[]): T => isFunction(g) ? g(...params) : g;

export type GetProperty<T, U> = keyof T | ((t: T) => U);
export const ofProperty = <T, U>(t: T, p: GetProperty<T, U>): U => isFunction(p) ? p(t) : t[p] as unknown as U;
