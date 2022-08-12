import { isList, List, toList } from './List';
import { Construct, ofConstruct } from './Constructor';
import { isA } from './IsA';

export type Sort = { key: string; value: -1 | 1 };

export type FilterValue = { label: string, value: unknown };
export type Filter = { label: string, field: string, values: FilterValue[] };

export type PageOptions = { take?: number; skip?: number; sort?: Sort[]; filter?: Filter[] };
export type PageList<T> = List<T> & Omit<PageOptions, 'sort' | 'filter'> & { total?: number };

export const isPageList = <T>(l?: T[]): l is PageList<T> => isList<T>(l) && isA(l, 'total');

export const toPageList = <T>(items?: T[], options?: Omit<PageOptions, 'sort' | 'filter'> & { total?: number }): PageList<T> => {
  const list = toList<T>(...(items ?? [])) as any;
  list.take = options?.take ?? 250;
  list.skip = options?.skip ?? 0;
  list.total = options?.total;
  return list;
};

export const asPageList = <T, U>(c: Construct<T>, items = toPageList<U>()): PageList<T> =>
  toPageList<T>(
    items.map(i => ofConstruct(c, i)),
    items,
  );
