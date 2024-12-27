export type DontInfer<T> = [T][T extends any ? 0 : never];

export type Optional<T> = T | undefined;

export type PartialRecord<K extends keyof any, T> = { [P in K]?: T };

export type FromObject<K, V> = { [key in keyof K]?: V };

export type FromKeys<T extends readonly (string | number | symbol)[], V = boolean> = FromObject<Record<T[number], unknown>, V>;
