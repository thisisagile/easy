import { DependencyList, useEffect, useState } from 'react';

export type UseOnceOptions<E> = {
  deps?: DependencyList;
  initial?: Partial<E>;
};

export function useOnce<E>(f: () => Promise<E>, options?: UseOnceOptions<E>): [E] {
  const [item, setItem] = useState(options?.initial as E);
  useEffect(() => void f().then(i => setItem(i)), options?.deps ?? []);
  return [item];
}
