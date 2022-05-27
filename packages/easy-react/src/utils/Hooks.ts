import { List, PageList, toList, toPageList, Validatable } from '@thisisagile/easy';
import { useState } from 'react';

export const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);
  return [state, () => setState(s => !s)];
};

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

export const usePageList = <E>(...items: E[]): [PageList<E>, (e: List<E>) => PageList<E>] => {
  const [pages, setPages] = useState<List<E>>(toPageList<E>(items));
  return [
    pages,
    (e: List<E>): PageList<E> => {
      setPages(e);
      return e;
    },
  ];
};

export const useGet = <E>(f: () => Promise<E>): [E | undefined, () => Promise<E>] => {
  const [item, setItem] = useState<E>();
  const getter = () => f().then(i => {
    setItem(i);
    return i;
  });
  return [item, getter];
};

export const useGetList = <E>(f: () => Promise<PageList<E>>): [PageList<E>, () => Promise<PageList<E>>] => {
  const [list, setList] = usePageList<E>();
  const getter = () => f().then(l => {
    setList(l);
    return l;
  });
  return [list, getter];
};
