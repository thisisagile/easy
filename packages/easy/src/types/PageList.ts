import { List, toList } from './List';

export type Sort = { key: string; value: -1 | 1 };

export type PageOptions = { take?: number; skip?: number; sort?: Sort[] };

export type PageList<T> = List<T> & Omit<PageOptions, 'sort'> & { total?: number };

export const toPageList = <T>(items?: T[], options?: Omit<PageOptions, 'sort'> & { total?: number }): PageList<T> => {
  const list = toList<T>(...(items ?? [])) as any;
  list.take = options?.take ?? 250;
  list.skip = options?.skip ?? 0;
  list.total = options?.total;
  return list;
};
