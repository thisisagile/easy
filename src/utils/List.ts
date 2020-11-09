import { GetProperty, isDefined, Json, jsonify, ofGet, ofProperty, Predicate } from '../types';
import { toArray } from './Array';

export class List<T> extends Array<T> {

  asc = (p: GetProperty<T, any>): List<T> =>
    this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));

  desc = (p: GetProperty<T, any>): List<T> =>
    this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));

  first = (p?: Predicate<T>): T => p ? this.filter(() => ofGet(p))[0] : this[0];

  last = (p?: Predicate<T>): T => p ? this.filter(() => ofGet(p))[0] : this[this.length - 1];

  toJSON = (): List<Json> => this.map(i => jsonify(i));

  map = <U>(f: (value: T, index: number, array: T[]) => U, params?: any): List<U> =>
    super.map(f, params) as List<U>;

  mapDefined = <U>(f: (value: T, index: number, array: T[]) => U, params?: any): List<U> =>
    this.map(f, params).filter(i => isDefined(i));

  filter = (predicate: (value: T, index: number, array: T[]) => unknown, params?: any): List<T> =>
    super.filter(predicate, params) as List<T>;

  concat = (...items: Array<T>[]): List<T> => super.concat(...items) as List<T>;

  add = (...items: (T | T[])[]): List<T> => this.concat(toArray(...items));
}

export const list = <T>(...items: (T | T[])[]): List<T> => new List<T>(...toArray(...items));
