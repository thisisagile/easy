import { toArray } from './Array';
import { Constructor, GetProperty, ofProperty } from './Constructor';
import { json, Json } from './Json';
import { isArray, isDefined } from './Is';
import { isA } from './IsA';

export class List<T> extends Array<T> {
  asc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));

  desc = (p: GetProperty<T, any>): List<T> => this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));

  first = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.filter(p, params).first() : this[0]);

  last = (p?: (value: T, index: number, array: T[]) => unknown, params?: unknown): T => (p ? this.filter(p, params).last() : this[this.length - 1]);

  toJSON = (): Json[] =>
    this.reduce((a, i) => {
      a.push(json.parse(i));
      return a;
    }, new Array<Json>());

  map = <U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<U> => super.map(f, params) as List<U>;

  mapDefined = <U>(f: (value: T, index: number, array: T[]) => U, params?: unknown): List<NonNullable<U>> => this.map(f, params).defined();

  distinct = (): List<T> => this.filter((i, index) => this.indexOf(i) === index);

  filter = (p: (value: T, index: number, array: T[]) => unknown, params?: unknown): List<T> => super.filter(p, params) as List<T>;

  concat = (...items: (T | ConcatArray<T>)[]): List<T> => super.concat(...items) as List<T>;

  add = (...items: (T | T[])[]): this => {
    super.push(...toArray(...items));
    return this;
  };

  defined = (): List<NonNullable<T>> => this.reduce((l, v) => (isDefined(v) ? l.add(v) : l), toList<NonNullable<T>>());
}

/**
 * @deprecated list will not be exported any more. Will be replaced by toList, to better handle a list of one item.
 */
export const list = <T>(...items: (T | T[])[]): List<T> => new List<T>(...toArray(...items));

export const toList = <T>(...items: (T | T[])[]): List<T> => (items.length > 1 ? list<T>(...items) : list<T>(items[0]));

export const isList = <T>(l?: unknown): l is List<T> => isDefined(l) && isArray(l) && isA<List<T>>(l, 'first', 'last', 'asc', 'desc');

export const asList = <T>(c: Constructor<T>, items: unknown[] = []): List<T> => toList<T>(items.map(i => new c(i)));
