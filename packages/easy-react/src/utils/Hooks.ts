import { Get, isPageList, List, ofGet, Optional, PageList, PageOptions, Predicate, toList, toPageList, Validatable } from '@thisisagile/easy';
import { useState } from 'react';

export const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);
  return [state, () => setState(s => !s)];
};

export function useSwitch<T>(...states: T[]): {
  state: T;
  next: () => void;
  states: T[];
  isState: Predicate<T>;
  ifState: <U>(t: T, yes: Get<U, T>, no: Get<U, T>) => U;
} {
  const [state, setState] = useState(states[0]);
  const next = () => setState(s => states[(states.indexOf(s) + 1) % states.length]);
  const isState = (t: T) => state === t;

  function ifState<U>(t: T, yes: Get<U, T>, no: Get<U, T>): U {
    return ofGet(state === t ? yes : no, t);
  }

  return { state, next, states, isState, ifState };
}

export const useA = <E extends Validatable>(item: Partial<E> = {} as Partial<E>): [E, (e: E) => E] => {
  const [state, setState] = useState<E>({ isValid: false, ...item } as E);
  return [
    state,
    (e: E): E => {
      setState(e);
      return e;
    },
  ];
};

export const useAn = useA;

export const useOptional = <E>(item?: Partial<E>): [E, (e: Optional<E>) => Optional<E>, () => Optional<E>] => {
  const [state, setState] = useState<E>(item as E);
  const set = (e?: Optional<E>): Optional<E> => {
    setState(e as E);
    return e;
  };
  return [state, set, (): Optional<E> => set()];
};

export const useEntity = useA;

export const useList = <E>(...items: E[]): [List<E>, (e: List<E>) => List<E>] => {
  const [state, setState] = useState<List<E>>(toList<E>(...items));
  return [
    state,
    (e: List<E>): List<E> => {
      setState(e);
      return e;
    },
  ];
};

export const usePageList = <E>(...items: E[]): [PageList<E>, (e: PageList<E>) => PageList<E>] => {
  const [pages, setPages] = useState<PageList<E>>(toPageList<E>(items));
  return [
    pages,
    (e: PageList<E>): PageList<E> => {
      setPages(e);
      return e;
    },
  ];
};

export const usePaging = <E>(
  f: (options?: PageOptions) => Promise<PageList<E>>,
  options?: PageOptions
): [PageList<E>, (options?: PageOptions) => Promise<PageList<E>>, boolean, number, number] => {
  const [list, setList] = usePageList<E>();
  const [skip, setSkip] = useState(options?.skip ?? 0);
  const [take] = useState(options?.take ?? 5);
  const next = (options: PageOptions = { skip, take }) =>
    f(options).then(items => {
      setSkip(skip + take);
      return setList(toPageList(list.add(items), items));
    });
  return [list, next, list.length < (list?.total ?? 0), skip, take];
};

export const useGet = <E>(f: () => Promise<E>, initial?: Partial<E>): [E, () => Promise<E>] => {
  const [item, setItem] = useState((initial ?? {}) as E);
  const getter = () =>
    f().then(i => {
      setItem(i);
      return i;
    });
  return [item, getter];
};

export const useGetList = <E>(f: () => Promise<List<E>>): [List<E>, () => Promise<PageList<E>>] => {
  const [list, setList] = usePageList<E>();
  const getter = () => f().then(l => setList(isPageList<E>(l) ? l : toPageList(l, { total: l.length })));
  return [list, getter];
};
