import { List, toList } from './List';
import { ArrayLike } from './Array';

export type TotalledList<T> = List<T> & { total?: number };

export const toTotalledList = <T>(items?: ArrayLike<T>, total?: number): TotalledList<T> => {
  const list = toList<T>(...items ?? []);
  (list as any).total = total;
  return list;
};
