import { Dispatch, SetStateAction, useState as useReactState } from 'react';

export function useState<T>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void];
export function useState<T>(initial: T): [T, Dispatch<SetStateAction<T>>, () => void];
export function useState<T>(initial?: T) {
  const [state, setState] = useReactState(initial);
  const reset = () => setState(initial);
  return [state, setState, reset] as const;
}
