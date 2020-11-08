import { isFunction } from './Is';

export type Constructor<T> = { new (...args: any[]): T };

export type Get<P, T> = T | ((...params: P[]) => T);
export type Predicate<P> = Get<P, boolean>;
export const ofGet = <P, T>(g: Get<P, T>, ...params: P[]): T => isFunction(g) ? g(...params) : g;

export type GetProperty<T, U> = keyof T | ((t: T) => U);
export const ofProperty = <T, U>(t: T, p: GetProperty<T, U>): U => isFunction(p) ? p(t) : t[p] as unknown as U;
