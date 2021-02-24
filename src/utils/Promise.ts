import { ErrorType } from '../types';

export const resolve = <S>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = <S>(e: ErrorType): Promise<S> => Promise.reject(e);
