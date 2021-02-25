import { ErrorOrigin } from '../types';

export const resolve = <S>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = <S>(e: ErrorOrigin): Promise<S> => Promise.reject(e);
