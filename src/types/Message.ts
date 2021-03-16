import { Func, isFunc } from './Constructor';

export type Message<Args> = string | Func<string, Args>;

export const ofMessage = <Args>(g: Message<Args>, ...params: Args[]): string => (isFunc<string, Args>(g) ? g(...params) : g);
