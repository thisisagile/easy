import { isList, List, toList } from './List';
import { Construct, ofConstruct, on } from './Constructor';
import { isA } from './IsA';

export const asc = 1;
export const desc = -1;
export type Sort = { key: string; value: -1 | 1 };

export type FilterValue = { label?: string; value: any };
export type Filter = { label?: string; field: string; shortField?: string; values: FilterValue[] };

export const toFilter = (field: string, value: any): Filter => toShortFilter(field, field, value);
export const toShortFilter = (field: string, shortField: string, value: any): Filter => ({
  field,
  shortField,
  values: [{ value }],
});

export type PageOptions = { take?: number; skip?: number; sort?: Sort[]; filters?: Filter[] };
export type PageList<T> = List<T> & Omit<PageOptions, 'sort'> & { total?: number };

export const isPageList = <T>(l?: T[]): l is PageList<T> => isList<T>(l) && isA(l, 'total');

export const toPageList = <T>(items?: T[], options?: Omit<PageOptions, 'sort'> & { total?: number }): PageList<T> =>
  on(toList<T>(...(items ?? [])) as PageList<T>, l => {
    l.take = options?.take ?? 250;
    l.skip = options?.skip ?? 0;
    l.total = options?.total;
    l.filters = options?.filters;
  });

export const asPageList = <T, U>(c: Construct<T>, items = toPageList<U>()): PageList<T> =>
  toPageList<T>(
    items.map(i => ofConstruct(c, i)),
    items,
  );
