import { ErrorOrigin, toArray } from '../types';

export const resolve = <S = unknown>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = <S = never>(e: ErrorOrigin): Promise<S> => Promise.reject(e);
export const tuple = <T>(...values: (T | PromiseLike<T>)[]): Promise<T[]> => Promise.all(toArray(values));
