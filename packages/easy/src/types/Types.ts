export type DontInfer<T> = [T][T extends any ? 0 : never];

export type Optional<T> = T | undefined;

export type PartialRecord<K extends keyof any, T> = { [P in K]?: T };

export type TypedKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type NumericKeys<T> = TypedKeys<T, number>;
