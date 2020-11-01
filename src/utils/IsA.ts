import { is } from "./Is";

export const isA = <T>(t?: unknown, ...properties: (keyof T)[]): t is T => is(t).defined && properties.every(p => is((t as T)[p]).defined);
export const isAn = isA;
