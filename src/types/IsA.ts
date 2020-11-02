import { isDefined } from "./Is";

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => isDefined(t) && properties.every(p => isDefined((t as T)[p]));
export const isAn = isA;
