export type Func<T, Args = unknown> = (...args: Args[]) => T;

export const isFunc = <T, Args>(o?: unknown): o is (...params: Args[]) => T => !!o && typeof o === 'function';
