export const asc = 1;
export const desc = -1;
export type SortDirection = typeof asc | typeof desc;
export type Sort = { key: string; value: SortDirection };
export type PlainSort = Record<string, SortDirection>;