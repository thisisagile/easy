type Falsy = false | 0 | -0 | 0n | '' | null | undefined;
type Truthy<T = unknown> = Exclude<T, Falsy>;

export const isFalsy = (v?: unknown): v is Falsy => !v;
export const isTruthy = (v?: unknown): v is Truthy => !isFalsy(v);
