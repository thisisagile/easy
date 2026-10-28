import { Get, ofGet } from './Get';
import { Id } from './Id';
import { List, toList } from './List';
import { isFunction } from './Is';
import { isAn } from './IsA';

type Identified = { id: Id };
type Pred<T> = (value: T, index: number, array: T[]) => unknown;

export type Registry<E extends Identified> = {
  all(): List<E>;
  byId(id: Id, alt?: Get<E, unknown>): E;
  byIds(ids?: Id[]): List<E>;
  filter(predicate: Pred<E>, params?: unknown): List<E>;
  first(predicate?: Pred<E>, params?: unknown): E;
};

export type RegistryQueries<E extends Identified> = Pick<Registry<E>, 'byId' | 'byIds'>;

export function isEnumRegistry<E extends Identified>(value: unknown): value is RegistryQueries<E> {
  return isAn<RegistryQueries<E>>(value, 'byId', 'byIds') && isFunction(value.byId) && isFunction(value.byIds);
}

export const registry = <E extends Identified>(values: Record<string, E>): Registry<E> => {
  const byIdLookup = toList(Object.values(values)).toObject('id') as Record<Id, E>;
  const all = (): List<E> => toList(Object.values(byIdLookup));

  return {
    all,
    byId: (id, alt) => byIdLookup[id] ?? ofGet(alt),
    byIds: (ids = []) =>
      toList(ids)
        .mapDefined(id => byIdLookup[id])
        .distinct(),
    filter: (predicate, params) => all().filter(predicate, params),
    first: (predicate, params) => all().first(predicate, params),
  };
};

export const lazyRegistry = <E extends Identified>(values: () => Record<string, E>): Registry<E> => {
  let current: Registry<E> | undefined;
  const get = (): Registry<E> => (current ??= registry(values()));

  return {
    all: () => get().all(),
    byId: (id, alt) => get().byId(id, alt),
    byIds: ids => get().byIds(ids),
    filter: (predicate, params) => get().filter(predicate, params),
    first: (predicate, params) => get().first(predicate, params),
  };
};
