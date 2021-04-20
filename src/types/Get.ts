import { Func, isFunc } from './Func';

export type Get<T = any, Args = any> = T | Func<T, Args>;
export type Predicate<Args> = Get<boolean, Args>;
export const ofGet = <T, Args = any>(g: Get<T, Args>, ...args: Args[]): T => (isFunc<T, Args>(g) ? g(...args) : g);
export const ifGet = <T>(pred: Get, valid: Get<T>, invalid: Get<T>): T => (ofGet(pred) ? ofGet(valid) : ofGet(invalid));
export type GetProperty<T, Prop> = keyof T | Func<Prop, T>;
export const ofProperty = <T, Prop>(t: T, p: GetProperty<T, Prop>): Prop => (isFunc<Prop, T>(p) ? p(t) : ((t as any)[p] as Prop));
