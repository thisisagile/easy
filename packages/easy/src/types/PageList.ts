import { List, toList } from './List';
import { json } from './Json';

export type PageOptions = { take?: number; skip?: number; total?: number };

export type PageList<T> = List<T> & PageOptions;

export const toPageList = <T>(items?: T[], options?: PageOptions): PageList<T> => {
  const o = json.defaults(options, { take: 250, skip: 0 });
  const list = toList<T>(...(items ?? [])) as any;
  list.take = o.take;
  list.skip = o.skip;
  list.total = o.total;
  return list;
};
