import { ArrayLike, toArray } from "./Array";
import { Constructor, on } from "./Constructor";
import { json, Json } from "./Json";
import { isArray, isDefined, isEmpty } from "./Is";
import { isA } from "./IsA";
import { Get, GetProperty, ofGet, ofProperty } from "./Get";
import { Id } from "./Id";
import { asString } from "./Text";
import { tryTo } from "./Try";
import { meta } from "./Meta";
import { Optional } from "./Types";

export class List<T = unknown> extends Array<T> {
  asc(p: GetProperty<T, any>): List<T> {
    return this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));
  }

  desc(p: GetProperty<T, any>): List<T> {
    return this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));
  }

  first(p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T {
    return (p ? this.find(p, params) : this[0]) as T;
  }

  firstValue<V>(f: (t: T) => V, alt?: Get<V, T>): Optional<V> {
    return tryTo(() => this.first(t => !!f(t))).map(i => (i ? f(i) : ofGet(alt, i))).value;
  }

  isFirst(value: T): boolean {
    return value === this.first();
  }

  next(p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T {
    return p ? this[this.findIndex(p, params) + 1] : this[0];
  }

  prev(p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T {
    return p ? this[this.findIndex(p, params) - 1] : this[0];
  }

  last(p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T {
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

  diffByKey(others: ArrayLike<T>, key: keyof T): List<T> {
    return this.filter((i: any) => !others.some((o: any) => o[key] === i[key]));
  }

  intersect(others: ArrayLike<T>): List<T> {
    return this.filter(i => others.includes(i));
  }

  intersectByKey(others: ArrayLike<T>, key: keyof T): List<T> {
    return this.filter((i: any) => others.some((o: any) => o[key] === i[key]));
  }

  toJSON(): Json[] {
    return this.reduce((a, i) => {
      a.push(json.parse(i));
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

  distinct(): List<T> {
    return this.filter((i, index) => this.indexOf(i) === index);
  }

  distinctByKey(key: keyof T): List<T> {
    return meta(this.toObject(key)).values();
  }

  filter(p: (value: T, index: number, array: T[]) => unknown, params?: unknown): List<T> {
    return toList<T>(super.filter(p, params));
  }

  sum(p: (t: T) => number): number {
    return this.reduce((sum: number, i) => sum + p(i), 0);
  }

  max(key: keyof T): T {
    return this.desc(key).first();
  }

  min(key: keyof T): T {
    return this.asc(key).first();
  }

  byId(id: Id): T {
    return this.first(i => asString((i as any).id) === asString(id));
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
    tryTo(() => item[key])
      .map(k => this.findIndex(i => i[key] === k))
      .filter(i => i > -1)
      .map(i => (this[i] = item));
    return this;
  }

  switch(item: T): List<T> {
    return this.includes(item) ? this.remove(item) : this.add(item);
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
    return this.reduce((a, t) => {
      const k = t[key] as unknown as string | number | symbol;
      a[k] = a[k] ?? toList();
      a[k].push(t);
      return a;
    }, {} as Record<string | number | symbol, List<T>>);
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
    return this.reduce((acc, _, index) =>
      (index % chunkSize === 0) ? on(acc, a => a.push(this.slice(index, index + chunkSize))) : acc, toList<List<T>>());
  }
}

export const toList = <T = unknown>(...items: ArrayLike<T>): List<T> => new List<T>().add(...items);

export const isList = <T>(l?: unknown): l is List<T> => isDefined(l) && isArray(l) && isA<List<T>>(l, "first", "last", "asc", "desc");

export const asList = <T>(c: Constructor<T>, items: unknown | unknown[] = []): List<T> => toList<T>(toArray(items).map(i => new c(i)));

export const maxValue = <T>(l: List<T>, key: keyof T): T[keyof T] | undefined => l.desc(key).first()?.[key];

export const minValue = <T>(l: List<T>, key: keyof T): T[keyof T] | undefined => l.asc(key).first()?.[key];
