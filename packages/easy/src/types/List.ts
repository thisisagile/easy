import { ArrayLike, toArray } from './Array';
import { Constructor, on, use } from './Constructor';
import type { Json } from './Json';
import { isArray, isDefined, isEmpty } from './Is';
import { isA } from './IsA';
import { Get, GetProperty, ofGet, ofProperty } from './Get';
import type { Id } from './Id';
import { asString } from './Text';
import { Optional } from './Types';
import { ifDefined, ifTrue } from '../utils/If';
import { AnyKey } from './AnyKey';
import { traverse } from '../utils/Traverse';
import { Indexed } from './Indexed';

type Pred<T> = (value: T, index: number, obj: T[]) => unknown;

export class List<T = unknown> extends Array<T> {
  get ids(): List<Id> {
    return this.mapDefined(i => (i as any).id as Id);
  }

  get indexed(): List<Indexed<T>> {
    return this.map((v, index) => ({ ...v, index }));
  }

  isSubSetOf(...items: ArrayLike<T>): boolean {
    return this.diff(items).length === 0;
  }

  isSuperSetOf(...items: ArrayLike<T>): boolean {
    return this.length > items.length && toList(...items).isSubSetOf(...this);
  }

  isIntersectingWith(...items: ArrayLike<T>): boolean {
    return this.intersect(items).length > 0;
  }

  isDisjointWith(...items: ArrayLike<T>): boolean {
    return !this.isIntersectingWith(...items);
  }

  areEqual(...items: ArrayLike<T>): boolean {
    return this.isSubSetOf(...items) && toList(...items).isSubSetOf(...this);
  }

  asc(p: GetProperty<T, any>): List<T> {
    return this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));
  }

  desc(p: GetProperty<T, any>): List<T> {
    return this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));
  }

  first(p?: Pred<T>, params?: unknown): T {
    return (p ? this.find(p, params) : this[0]) as T;
  }

  firstValue<V>(f: (t: T) => V, alt?: Get<V, T>): Optional<V> {
    return ifDefined(
      this.first(t => !!f(t)),
      f,
      v => ofGet(alt, v)
    );
  }

  isFirst(value: T): boolean {
    return value === this.first();
  }

  next(p?: Pred<T>, params?: unknown): T {
    return p ? this[this.findIndex(p, params) + 1] : this[0];
  }

  prev(p?: Pred<T>, params?: unknown): T {
    return p ? this[this.findIndex(p, params) - 1] : this[0];
  }

  last(p?: Pred<T>, params?: unknown): T {
    return p ? this.filter(p, params).last() : this[this.length - 1];
  }

  isLast(value: T): boolean {
    return value === this.last();
  }

  overlaps(...items: ArrayLike<T>): boolean {
    return toList<T>(...items).some(i => this.some(t => i === t));
  }

  diff(others: ArrayLike<T>): List<T> {
    return this.filter(i => !others.includes(i));
  }

  diffByKey<U = T>(others: ArrayLike<U>, key: keyof T & keyof U): List<T> {
    return this.filter((i: any) => !others.some((o: any) => o[key] === i[key]));
  }

  symmetricDiff(others: ArrayLike<T>): List<T> {
    return this.diff(others).concat(toList<T>(...others).diff(this));
  }

  symmetricDiffByKey(others: ArrayLike<T>, key: keyof T): List<T> {
    return this.diffByKey(others, key).concat(toList<T>(...others).diffByKey(this, key));
  }

  intersect(others: ArrayLike<T>): List<T> {
    return this.filter(i => others.includes(i));
  }

  intersectByKey<U>(others: ArrayLike<U>, key: keyof T & keyof U): List<T> {
    return this.filter((i: any) => others.some((o: any) => o[key] === i[key]));
  }

  intersectBy<U>(others: ArrayLike<U>, f: (value: T, value2: U) => boolean): List<T> {
    return this.filter(i => others.some(o => f(i, o as U)));
  }

  accumulate(...keys: (keyof T)[]): List<T> {
    return this.map((d, i, arr) => {
      const acc = keys.reduce((acc, v) => {
        (acc as any)[v] = i === 0 ? d[v] : (arr[i - 1][v] as number) + (d[v] as number);
        return acc;
      }, d);
      arr[i] = acc;
      return acc;
    });
  }

  toJSON(): Json[] {
    return this.reduce((a, i) => {
      a.push(JSON.parse(JSON.stringify(i ?? {})));
      return a;
    }, new Array<Json>());
  }

  map<U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<U> {
    return toList<U>(super.map(f, params));
  }

  flatMap<U, This = unknown>(f: (this: This, value: T, index: number, array: T[]) => ReadonlyArray<U> | U, params?: This): List<U> {
    return toList<U>(super.flatMap(f, params));
  }

  mapDefined<U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<NonNullable<U>> {
    return this.map(f, params).defined();
  }

  mapAsync(f: (i: T) => Promise<T>): Promise<List<T>> {
    return Promise.all(super.map(e => f(e))).then(a => toList<T>(a));
  }

  mapSerial<U>(f: (i: T) => Promise<U>): Promise<List<U>> {
    return super.reduce((p, item) => p.then(results => on(results, async r => r.push(await f(item)))), Promise.resolve(toList<U>()));
  }

  distinct(): List<T> {
    return this.filter((i, index) => this.indexOf(i) === index);
  }

  distinctByKey(key: keyof T): List<T> {
    const seen = new Set<T[keyof T]>();
    return this.filter(item => !seen.has(item[key]) && seen.add(item[key]));
  }

  distinctByValue(): List<T> {
    const seen = new Set<string>();
    return this.filter(item => !seen.has(JSON.stringify(item)) && seen.add(JSON.stringify(item)));
  }

  filter(p: Pred<T>, params?: unknown): List<T> {
    return toList<T>(super.filter(p, params));
  }

  sum(p: (t: T) => number): number {
    return this.reduce((sum: number, i) => sum + p(i), 0);
  }

  max(p: (value: T) => any): T;

  max(key: keyof T): T;

  max(p: keyof T | ((value: T) => any)): T {
    return typeof p === 'function' ? this.sort((e1, e2) => (p(e1) < p(e2) ? 1 : -1)).first() : this.desc(p).first();
  }

  min(key: keyof T): T;

  min(p: (value: T) => any): T;

  min(p: keyof T | ((value: T) => any)): T {
    return typeof p === 'function' ? this.sort((e1, e2) => (p(e1) > p(e2) ? 1 : -1)).first() : this.asc(p).first();
  }

  byId(id: Id): T {
    return this.first(i => asString((i as any).id) === asString(id));
  }

  byKey(key: keyof T, value: unknown): T {
    return this.first(i => i[key] == value);
  }

  add(...items: ArrayLike<T>): this {
    super.push(...toArray(...items));
    return this;
  }

  concat(...items: ConcatArray<T>[]): List<T>;

  concat(...items: (T | ConcatArray<T>)[]): List<T>;

  concat(...items: (T | ConcatArray<T>)[]): List<T> {
    return toList<T>(super.concat(...items));
  }

  reverse(): List<T> {
    return toList<T>(super.reverse());
  }

  splice(start: number, deleteCount?: number): List<T>;

  splice(start: number, deleteCount: number, ...items: T[]): List<T>;

  splice(start: number, deleteCount: number, ...items: T[]): List<T> {
    return toList<T>(super.splice(start, deleteCount, ...items));
  }

  remove(item: T): List<T> {
    const index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
    return this;
  }

  replace(key: keyof T, item: T): List<T> {
    const index = this.findIndex(i => i[key] === item?.[key]);
    ifTrue(index != -1, () => this.splice(index, 1, item));
    return this;
  }

  switch(item: T): List<T> {
    return this.includes(item) ? this.remove(item) : this.add(item);
  }

  switchOn<U = T>(item: U, on: AnyKey<U>): List<T>;

  switchOn<T>(item: T, on: Pred<T>): List<T>;

  switchOn<U = T>(item: T, on: AnyKey<U> | Pred<T>): List<T> {
    return use(typeof on === 'function' ? this.find(on) : use(traverse(item, on), v => this.find(i => traverse(i, on) === v)), i =>
      i ? this.remove(i) : this.add(item)
    );
  }

  defined(): List<NonNullable<T>> {
    return this.reduce((l, v) => (isDefined(v) ? l.add(v) : l), toList<NonNullable<T>>());
  }

  toObject(key: keyof T, options: { deleteKey?: boolean } = {}): Record<string | number | symbol, T> {
    return this.reduce((o: any, i) => {
      o[i[key]] = i;
      if (options.deleteKey) delete o[i[key]][key];
      return o;
    }, {});
  }

  toObjectList(key: keyof T): Record<string | number | symbol, List<T>> {
    return this.reduce(
      (a, t) => {
        const k = t[key] as unknown as string | number | symbol;
        a[k] = a[k] ?? toList();
        a[k].push(t);
        return a;
      },
      {} as Record<string | number | symbol, List<T>>
    );
  }

  orElse(...alt: ArrayLike<T>): Optional<List<T>> {
    return !isEmpty(this) ? this : !isEmpty(...alt) ? toList<T>(...alt) : undefined;
  }

  weave(insertFrom: T[], interval: number): this {
    for (let i = interval, n = 0; i <= this.length && n < insertFrom.length; i += interval + 1) {
      this.splice(i, 0, insertFrom[n++]);
    }
    return this;
  }

  slice(start?: number, end?: number): List<T> {
    return toList(super.slice(start, end));
  }

  none(p: (t: T) => boolean): boolean {
    return !this.some(p);
  }

  chunk(chunkSize: number): List<List<T>> {
    return this.reduce((acc, _, index) => (index % chunkSize === 0 ? on(acc, a => a.push(this.slice(index, index + chunkSize))) : acc), toList<List<T>>());
  }

  //we needed to add U because of a Typescript issue with generics
  update<U = T>(p: Pred<T>, val: T | ((v: U) => T)): List<T> {
    return this.map((v, i, a) => (p(v, i, a) ? ofGet<T>(val, v, i, a) : v));
  }

  updateFirst<U = T>(p: Pred<T>, val: T | ((v: U) => T)) {
    const index = this.findIndex(p);
    return this.update((t, i) => p(t, i, this) && i == index, val);
  }

  updateFirstById<U = T>(id: Id, val: T | ((v: U) => T)) {
    return this.updateFirst(i => asString((i as any)?.id) === asString(id), val);
  }

  updateById<U = T>(id: Id, val: T | ((v: U) => T)) {
    return this.update(i => asString((i as any)?.id) === asString(id), val);
  }
}

export const toList = <T = unknown>(...items: ArrayLike<T>): List<T> => new List<T>().add(...items);

export const isList = <T>(l?: unknown): l is List<T> => isDefined(l) && isArray(l) && isA<List<T>>(l, 'first', 'last', 'asc', 'desc');

export const asList = <T>(c: Constructor<T>, items: unknown = []): List<T> => toList<T>(toArray(items).map(i => new c(i)));

export const maxValue = <T>(l: List<T>, key: keyof T): T[keyof T] | undefined => l.desc(key).first()?.[key];

export const minValue = <T>(l: List<T>, key: keyof T): T[keyof T] | undefined => l.asc(key).first()?.[key];
