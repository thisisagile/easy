import {isDefined, isFunction} from './Is';
import {Get, ofGet} from './Constructor';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t?.toString) && isFunction(t.toString);

export const ifText = (t?: unknown, alt: Get<string> = ''): string => isText(t) ? t.toString() : ofGet(alt);
