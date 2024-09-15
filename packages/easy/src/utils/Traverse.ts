import { AnyKey } from '../types/AnyKey';

export const traverse = (subject: unknown = {}, property = ''): unknown => {
  const props = property.split('.');
  const p = props.shift() as string;
  return props.length === 0 ? (subject as any)[p] : traverse((subject as any)[p], props.join('.'));
};

export const traverseSet = <T>(subject: T, property: AnyKey<T>, value: unknown): unknown => {
  const props = property.split('.');
  const p = props.shift() as string;
  return {
    ...(subject as any),
    [p]: props.length === 0 ? value : traverseSet((subject as any)[p], props.join('.'), value),
  } as T;
};

export const accumulate = <T>(items: T[], ...keys: AnyKey<T>[]): T[] =>
  items.map((t, i, arr) => {
    const acc = keys.reduce(
      (acc, v) => traverseSet(acc, v, i === 0 ? traverse(t, v) : (traverse(arr[i - 1], v) as number) + (traverse(t, v) as number)) as T,
      t
    );
    arr[i] = acc;
    return acc;
  });
