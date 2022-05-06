import { List, toList } from './List';

export type PageList<T> = List<T> & { skip?: number, take?: number, total?: number };

export const toPageList = <T>(items?: T[], total?: number): PageList<T> => {
  const list = toList<T>(...items ?? []);
  (list as any).total = total;
  return list;
};
