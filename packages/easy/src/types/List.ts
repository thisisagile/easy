import { ArrayLike, toArray, toObject as toObjectArray } from './Array';
import { Constructor } from './Constructor';
import { json, Json } from './Json';
import { isArray, isDefined, isEmpty } from './Is';
import { isA } from './IsA';
import { Get, GetProperty, ofGet, ofProperty } from './Get';
import { Id } from './Id';
import { asString } from './Text';
import { tryTo } from './Try';

export class List<T = unknown> extends Array<T> {
  asc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));

  desc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));

  first = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.find(p, params) : this[0]) as T;

  firstValue = <V>(f: (t: T) => V, alt?: Get<V, T>): V | undefined => tryTo(() => this.first(t => !!f(t))).map(i => (i ? f(i) : ofGet(alt, i))).value;

  isFirst = (value: T): boolean => value === this.first();

  next = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this[this.findIndex(p, params) + 1] : this[0]);

  prev = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this[this.findIndex(p, params) - 1] : this[0]);

  last = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.filter(p, params).last() : this[this.length - 1]);

  isLast = (value: T): boolean => value === this.last();

  overlaps = (...items: ArrayLike<T>): boolean => toList<T>(...items).some(i => this.some(t => i === t));

  diff = (others: ArrayLike<T>): List<T> => this.filter(i => !others.includes(i));

  diffByKey = (others: ArrayLike<T>, key: keyof T): List<T> => this.filter((i: any) => !others.some((o: any) => o[key] === i[key]));

  intersect = (others: ArrayLike<T>): List<T> => this.filter(i => others.includes(i));

  intersectByKey = (others: ArrayLike<T>, key: keyof T): List<T> => this.filter((i: any) => others.some((o: any) => o[key] === i[key]));

  toJSON = (): Json[] =>
    this.reduce((a, i) => {
      a.push(json.parse(i));
      return a;
    }, new Array<Json>());

  map = <U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<U> => toList<U>(super.map(f, params));

  flatMap = <U, This = unknown>(f: (this: This, value: T, index: number, array: T[]) => ReadonlyArray<U> | U, params?: This): List<U> =>
    toList<U>(super.flatMap(f, params));

  mapDefined = <U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<NonNullable<U>> => this.map(f, params).defined();

  mapAsync = (f: (i: T) => Promise<T>): Promise<List<T>> => Promise.all(super.map(e => f(e))).then(a => toList<T>(a));

  distinct = (): List<T> => this.filter((i, index) => this.indexOf(i) === index);

  filter = (p: (value: T, index: number, array: T[]) => unknown, params?: unknown): List<T> => toList<T>(super.filter(p, params));

  sum = (p: (t: T) => number): number => this.reduce((sum: number, i) => sum + p(i), 0);

  byId = (id: Id): T => this.first(i => asString((i as any).id) === asString(id));

  add = (...items: (T | T[])[]): this => {
    super.push(...toArray(...items));
    return this;
  };

  remove = (item: T): List<T> => {
    const index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
    return this;
  };

  switch = (item: T): List<T> => (this.includes(item) ? this.remove(item) : this.add(item));

  defined = (): List<NonNullable<T>> => this.reduce((l, v) => (isDefined(v) ? l.add(v) : l), toList<NonNullable<T>>());

  toObject = (key: keyof T): Record<string | number | symbol, T> => toObjectArray<T>(key, this);

  toObjectList = (key: keyof T): Record<string | number | symbol, List<T>> =>
    this.reduce((a, t) => {
      const k = t[key] as unknown as (string | number | symbol);
      a[k] = a[k] ? a[k] : toList();
      a[k].push(t);
      return a;
    }, {} as Record<string | number | symbol, List<T>>);

  orElse = (...alt: ArrayLike<T>): List<T> | undefined => (!isEmpty(this) ? this : !isEmpty(...alt) ? toList<T>(...alt) : undefined);

  weave = (insertFrom: T[], interval: number): this => {
    for (let i = interval, n = 0; i <= this.length && n < insertFrom.length; i += interval + 1) {
      this.splice(i, 0, insertFrom[n++]);
    }
    return this;
  };
}

export const toList = <T = unknown>(...items: ArrayLike<T>): List<T> => new List<T>().add(...items);

export const isList = <T>(l?: unknown): l is List<T> => isDefined(l) && isArray(l) && isA<List<T>>(l, 'first', 'last', 'asc', 'desc');

export const asList = <T>(c: Constructor<T>, items: unknown | unknown[] = []): List<T> => toList<T>(toArray(items).map(i => new c(i)));
