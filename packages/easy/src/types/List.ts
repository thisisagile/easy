import { ArrayLike, toArray, toObject as toObjectArray } from './Array';
import { Constructor } from './Constructor';
import { json, Json } from './Json';
import { isArray, isDefined, isEmpty } from './Is';
import { isA } from './IsA';
import { GetProperty, ofProperty } from './Get';
import { Id } from './Id';
import { asString } from './Text';

export class List<T = unknown> extends Array<T> {
  asc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));

  desc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));

  first = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.filter(p, params).first() : this[0]);

  isFirst = (value: T): boolean => value === this.first();

  next = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this[this.findIndex(p, params) + 1] : this[0]);

  prev = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this[this.findIndex(p, params) - 1] : this[0]);

  last = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.filter(p, params).last() : this[this.length - 1]);

  isLast = (value: T): boolean => value === this.last();

  overlaps = (...items: ArrayLike<T>): boolean => toList<T>(...items).some(i => this.some(t => i === t));

  toJSON = (): Json[] =>
    this.reduce((a, i) => {
      a.push(json.parse(i));
      return a;
    }, new Array<Json>());

  map = <U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<U> => toList<U>(super.map(f, params));

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

  toObject = (key: keyof T): Json => toObjectArray<T>(key, this);

  orElse = (...alt: ArrayLike<T>): List<T> | undefined => (!isEmpty(this) ? this : !isEmpty(...alt) ? toList<T>(...alt) : undefined);
}

export const toList = <T = unknown>(...items: ArrayLike<T>): List<T> => new List<T>(...toArray<T>(...items));

export const isList = <T>(l?: unknown): l is List<T> => isDefined(l) && isArray(l) && isA<List<T>>(l, 'first', 'last', 'asc', 'desc');

// export const asList = <T>(c: Constructor<T>, items: unknown[] = []): List<T> => toList<T>(items.map(i => new c(i)));
export const asList = <T>(c: Constructor<T>, items: unknown | unknown[] = []): List<T> => toList<T>(toArray(items).map(i => new c(i)));
