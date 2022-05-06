import { List, toList } from './List';

export type PageOptions = { take?: number, skip?: number, total?: number };

export type PageList<T> = List<T> & PageOptions;

export const toPageList = <T>(items?: T[], options: PageOptions = {take: 250, skip: 0}): PageList<T> => {
  const list = toList<T>(...items ?? []) as any;
  list.take = options.take;
  list.skip = options.skip;
  list.total = options.total;
  return list;
};
