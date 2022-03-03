import { ErrorOrigin } from '../types';

type Pro<A> = A | PromiseLike<A>;
type Aw<A> = Awaited<A>;

export const resolve = <S = unknown>(subject: S | PromiseLike<S>): Promise<S> => Promise.resolve(subject);
export const reject = <S = never>(e: ErrorOrigin): Promise<S> => Promise.reject(e);

export const tuple = {
  2: <F, S>(first: Pro<F>, second: Pro<S>): Promise<[Aw<F>, Aw<S>]> => Promise.all([first, second]),
  3: <F, S, T>(first: Pro<F>, second: Pro<S>, third: Pro<T>): Promise<[Aw<F>, Aw<S>, Aw<T>]> => Promise.all([first, second, third]),
  4: <F, S, T, Fo>(first: Pro<F>, second: Pro<S>, third: Pro<T>, forth: Pro<Fo>): Promise<[Aw<F>, Aw<S>, Aw<T>, Aw<Fo>]> => Promise.all([first, second, third, forth]),
  5: <F, S, T, Fo, Fi>(first: Pro<F>, second: Pro<S>, third: Pro<T>, forth: Pro<Fo>, fifth: Pro<Fi>): Promise<[Aw<F>, Aw<S>, Aw<T>, Aw<Fo>, Aw<Fi>]> => Promise.all([first, second, third, forth, fifth]),
};

