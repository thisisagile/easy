export type Nullish = null | undefined;

export const isNullish = (v?: unknown): v is Nullish => v == null;
