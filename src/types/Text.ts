import { isDefined, isFunction } from './Is';
import { Get, ofGet } from './Constructor';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t?.toString) && isFunction(t.toString);

export const toString = (t?: unknown, alt: Get<Text> = ''): string => (isText(t) ? t : ofGet(alt)).toString();
