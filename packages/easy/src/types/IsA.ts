import { isPrimitive } from './Primitive';
import { Identity } from './Identity';
import { use } from './Constructor';
import { isDefined, isObject } from './Is';

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => !isPrimitive(t) && properties.every(p => p.toString() in (t as any));
export const isAn = isA;
export const isIdentity = (by: unknown): by is Identity => use(by as Identity, b => isObject(b) && isDefined(b.id));
