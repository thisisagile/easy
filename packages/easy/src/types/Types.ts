export type DontInfer<T> = [T][T extends any ? 0 : never];

export type Optional<T> = T | undefined;

export type PartialRecord<K extends keyof any, T> = { [P in K]?: T };

export type FromKeys<T extends readonly (string | number | symbol)[], V = boolean> = {
  [key in T[number]]: V;
};
