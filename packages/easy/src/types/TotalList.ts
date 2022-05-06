import { List, toList } from './List';

export type TotalList<T> = List<T> & { total?: number };

export const toTotalList = <T>(items?: T[], total?: number): TotalList<T> => {
  const list = toList<T>(...items ?? []);
  (list as any).total = total;
  return list;
};
