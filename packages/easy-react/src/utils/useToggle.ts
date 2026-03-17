import { useState } from 'react';

export function useToggle(initial = false): [boolean, () => void, <T>(fn: () => Promise<T>) => Promise<T>] {
  const [state, setState] = useState(initial);
  const toggle = () => setState(s => !s);
  const flip = <T>(fn: () => Promise<T>) => {
    setState(s => !s);
    return fn().finally(() => setState(s => !s));
  };
  return [state, toggle, flip];
}
