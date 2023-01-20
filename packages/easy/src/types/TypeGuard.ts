export type TypeGuard<T extends From, From = unknown> = (value?: From) => value is T;
