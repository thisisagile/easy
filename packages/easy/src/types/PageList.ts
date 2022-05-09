import { List, toList } from './List';
import { json } from './Json';

export type Sort = { key: string, value: -1 | 1 };

export type PageOptions = { take?: number, skip?: number, sort?: Sort[] };

export type PageList<T> = List<T> & Omit<PageOptions, 'sort'> & { total?: number };

export const toPageList = <T>( items?: T[], options?: PageOptions & { total?: number }): PageList<T> => {
  const o = json.defaults(options, { take: 250, skip: 0 });
  const list = toList<T>(...(items ?? [])) as any;
  list.take = o.take;
  list.skip = o.skip;
  list.total = o.total;
  return list;
};
