import { List, toList } from './List';
import { ArrayLike } from './Array';

export type TotalList<T> = List<T> & { total?: number };

export const toTotalList = <T>(items?: ArrayLike<T>, total?: number): TotalList<T> => {
  const list = toList<T>(...items ?? []);
  (list as any).total = total;
  return list;
};
