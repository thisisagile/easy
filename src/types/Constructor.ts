import { isFunction } from './Is';

export type Constructor<T> = { new (...args: any[]): T };

export type Get<P, T> = T | ((...params: P[]) => T);
export type Predicate<P> = Get<P, boolean>;

export const ofGet = <P, T>(g: Get<P, T>, ...params: P[]): T => isFunction(g) ? g(...params) : g;
