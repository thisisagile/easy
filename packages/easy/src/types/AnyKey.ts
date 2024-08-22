export type AnyKey<T> = {
  [Key in keyof T & (string | number)]: T[Key] extends object ? `${Key}` | `${Key}.${AnyKey<T[Key]>}` : `${Key}`;
}[keyof T & (string | number)];
