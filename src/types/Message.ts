import { isFunction } from './Is';

export type Message<Param extends unknown> = string | ((...params: Param[]) => string);

export const ofMessage = <Param>(g: Message<Param>, ...params: Param[]): string => (isFunction(g) ? g(...params) : g);
