import { isError, isText, results, Results, Text } from '../types';

export const resolve = <S>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = (e: Text | Error | Results) => Promise.reject(isError(e) ? e : isText(e) ? results(e) : e);
