import { isPrimitive } from './Primitive';

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => !isPrimitive(t) && properties.every(p => p.toString() in (t as any));
export const isAn = isA;
