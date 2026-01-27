export type AnyKey<T, Visited = never> = {
  [Key in keyof T & (string | number)]: T[Key] extends object
    ? T[Key] extends (...args: unknown[]) => unknown
      ? `${Key}` // don't recurse into function types
      : T[Key] extends Visited
        ? `${Key}` // already visiting this type -> break cycle
        : Key extends keyof T[Key] & (string | number)
          ? `${Key}` // nested type has same key (e.g. inAmsterdam().inAmsterdam()) -> break chain
          : `${Key}` | `${Key}.${AnyKey<T[Key], Visited | T>}`
    : `${Key}`;
}[keyof T & (string | number)];
