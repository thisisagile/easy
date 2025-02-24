import { isList, List, toList } from './List';
import { Construct, ofConstruct } from './Constructor';
import { isA } from './IsA';
import { PlainSort, Sort } from './Sort';
import { GetProperty } from './Get';
import { ArrayLike } from './Array';
import { Optional } from './Types';
import { isNumber } from './Is';
import { choose } from './Case';
import type { Id } from './Id';

export type FilterValue = { label?: string; value: any, count?: number };
export type Filter = { label?: string; field: string; shortField?: string; values: FilterValue[] };

export const toFilter = (field: string, value: any): Filter => toShortFilter(field, field, value);
export const toShortFilter = (field: string, shortField: string, value: any): Filter => ({
  field,
  shortField,
  values: [{ value }],
});

export type PageOptions = { take?: number; skip?: number; sort?: Sort[]; sorts?: PlainSort; filters?: Filter[] };
export type PageListOptions = Exclude<PageOptions, 'sort'> & { total?: number };

export class PageList<T> extends List<T> {
  private _options?: PageListOptions;

  get options(): Optional<PageListOptions> {
    return this._options;
  }

  get take(): number {
    return this._options?.take ?? 250;
  }

  get skip(): number {
    return this._options?.skip ?? 0;
  }

  get total(): Optional<number> {
    return this._options?.total;
  }

  get sorts(): Optional<PlainSort> {
    return this._options?.sorts;
  }

  get filters(): Optional<Filter[]> {
    return this._options?.filters;
  }

  get meta(): PageListOptions {
    return {
      take: this.take,
      skip: this.skip,
      total: this.total,
      sorts: this.sorts,
      filters: this.filters,
    };
  }

  get ids(): PageList<Id> {
    return this.mapDefined(i => (i as any).id as Id);
  }

  asc(p: GetProperty<T, any>): PageList<T> {
    return toPageList(super.asc(p), this);
  }

  desc(p: GetProperty<T, any>): PageList<T> {
    return toPageList(super.desc(p), this);
  }

  diff(others: ArrayLike<T>): PageList<T> {
    return toPageList(super.diff(others), this);
  }

  diffByKey<U = T>(others: ArrayLike<U>, key: keyof T & keyof U): PageList<T> {
    return toPageList(super.diffByKey(others, key), this);
  }

  symmetricDiff(others: ArrayLike<T>): PageList<T> {
    return toPageList(super.symmetricDiff(others), this);
  }

  symmetricDiffByKey(others: ArrayLike<T>, key: keyof T): PageList<T> {
    return toPageList(super.symmetricDiffByKey(others, key), this);
  }

  intersect(others: ArrayLike<T>): PageList<T> {
    return toPageList(super.intersect(others), this);
  }

  intersectByKey<U>(others: ArrayLike<U>, key: keyof T & keyof U): PageList<T> {
    return toPageList(super.intersectByKey(others, key), this);
  }

  map<U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): PageList<U> {
    const items = super.map(f, params);
    return toPageList(items, this);
  }

  flatMap<U, This = unknown>(f: (this: This, value: T, index: number, array: T[]) => ReadonlyArray<U> | U, params?: This): PageList<U> {
    return toPageList(super.flatMap(f, params), this);
  }

  mapDefined<U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): PageList<NonNullable<U>> {
    return toPageList(super.mapDefined(f, params), this);
  }

  mapAsync(f: (i: T) => Promise<T>): Promise<PageList<T>> {
    return super.mapAsync(f).then(r => toPageList(r, this));
  }

  areEqual(...items: ArrayLike<T> ): boolean {
    return this.isSubSetOf(...items) && toList(...items).isSubSetOf(...this);
  }

  distinct(): PageList<T> {
    return toPageList(super.distinct(), this);
  }

  distinctByKey(key: keyof T): PageList<T> {
    return toPageList(super.distinctByKey(key), this);
  }

  distinctByValue(): PageList<T> {
    return toPageList(super.distinctByValue(), this);
  }

  filter(p: (value: T, index: number, array: T[]) => unknown, params?: unknown): PageList<T> {
    return toPageList(super.filter(p, params), this);
  }

  accumulate(...keys: (keyof T)[]): PageList<T> {
    return toPageList(super.accumulate(...keys), this);
  }

  concat(...items: ConcatArray<T>[]): PageList<T>;

  concat(...items: (T | ConcatArray<T>)[]): PageList<T>;

  concat(...items: (T | ConcatArray<T>)[]): PageList<T> {
    return toPageList(super.concat(...items), this);
  }

  reverse(): PageList<T> {
    return toPageList(super.reverse(), this);
  }

  splice(start: number, deleteCount?: number): PageList<T>;

  splice(start: number, deleteCount: number, ...items: T[]): PageList<T>;

  splice(start: number, deleteCount: number, ...items: T[]): PageList<T> {
    return toPageList(super.splice(start, deleteCount, ...items), this);
  }

  remove(item: T): PageList<T> {
    return toPageList(super.remove(item), this);
  }

  replace(key: keyof T, item: T): PageList<T> {
    return toPageList(super.replace(key, item), this);
  }

  switch(item: T): PageList<T> {
    return toPageList(super.switch(item), this);
  }

  defined(): PageList<NonNullable<T>> {
    return toPageList(super.defined(), this);
  }

  orElse(...alt: ArrayLike<T>): Optional<PageList<T>> {
    return toPageList(super.orElse(...alt), this);
  }

  slice(start?: number, end?: number): PageList<T> {
    return toPageList(super.slice(start, end), this);
  }

  //we needed to add U because of a Typescript issue with generics
  update<U = T>(p: (value: T, index: number, array: T[]) => unknown, val: T | ((v: U) => T)): PageList<T> {
    return toPageList(super.update(p, val), this);
  }

  updateFirst<U = T>(p: (value: T, index: number, array: T[]) => unknown, val: T | ((v: U) => T)): PageList<T> {
    return toPageList(super.updateFirst(p, val), this);
  }

  updateFirstById<U = T>(id: Id, val: T | ((v: U) => T)): PageList<T> {
    return toPageList(super.updateFirstById(id, val), this);
  }

  updateById<U = T>(id: Id, val: T | ((v: U) => T)): PageList<T> {
    return toPageList(super.updateById(id, val), this);
  }

  private setPageOptions(options?: PageListOptions): this {
    this._options = options;
    return this;
  }
}

export const isPageList = <T>(l?: unknown): l is PageList<T> => isList<T>(l) && isA(l, 'total');

export const toPageList = <T>(items: T[] = [], options?: Omit<PageOptions, 'sort'> & { total?: number }): PageList<T> =>
  (
    choose(items)
      .case(
        i => i.length === 1 && isNumber(i[0]),
        i => new PageList<T>().add(...i)
      )
      .else(i => new PageList<T>(...i)) as any
  ).setPageOptions(options);

/* @deprecated No longer needed as the PageList is now a class that extends from List, use the map function */
export const asPageList = <T, U>(c: Construct<T>, items = toPageList<U>()): PageList<T> => items.map(i => ofConstruct(c, i));
