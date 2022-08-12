import { isList, List, toList } from './List';
import { Construct, ofConstruct } from './Constructor';
import { isA } from './IsA';

export type Sort = { key: string; value: -1 | 1 };

export type FilterValue = { label: string, value: any };
export type Filter = { label: string, field: string, values: FilterValue[] };

export type PageOptions = { take?: number; skip?: number; sort?: Sort[]; filters?: Filter[] };
export type PageList<T> = List<T> & Omit<PageOptions, 'sort'> & { total?: number };

export const isPageList = <T>(l?: T[]): l is PageList<T> => isList<T>(l) && isA(l, 'total');

export const toPageList = <T>(items?: T[], options?: Omit<PageOptions, 'sort'> & { total?: number }): PageList<T> => {
  const list = toList<T>(...(items ?? [])) as PageList<T>;
  list.take = options?.take ?? 250;
  list.skip = options?.skip ?? 0;
  list.total = options?.total;
  list.filters = options?.filters;
  return list;
};

export const asPageList = <T, U>(c: Construct<T>, items = toPageList<U>()): PageList<T> =>
  toPageList<T>(
    items.map(i => ofConstruct(c, i)),
    items,
  );
