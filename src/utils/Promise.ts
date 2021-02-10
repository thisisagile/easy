import { isError, isText, results, Results, Text } from "../types";

export const resolve = <S>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = <S>(e: Text | Error | Results): Promise<S> => Promise.reject(isError(e) ? e : isText(e) ? results(e) : e);
