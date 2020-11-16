import { toArray } from './Array';
import { GetProperty, ofProperty } from './Constructor';
import { Json, jsonify } from './Json';
import { isDefined } from './Is';

export class List<T> extends Array<T> {

  asc = (p: GetProperty<T, any>): List<T> =>
    this.sort((e1, e2) => (ofProperty(e1, p) > ofProperty(e2, p) ? 1 : -1));

  desc = (p: GetProperty<T, any>): List<T> =>
    this.sort((e1, e2) => (ofProperty(e1, p) < ofProperty(e2, p) ? 1 : -1));

  first = (p?: (value: T, index: number, array: T[]) => unknown, params?: any): T =>
    p ? this.filter(p, params).first() : this[0];

  last = (p?: (value: T, index: number, array: T[]) => unknown, params?: any): T =>
    p ? this.filter(p, params).last() : this[this.length - 1];

  toJSON = (): List<Json> => this.map(i => jsonify(i));

  map = <U>(f: (value: T, index: number, array: T[]) => U, params?: any): List<U> =>
    super.map(f, params) as List<U>;

  mapDefined = <U>(f: (value: T, index: number, array: T[]) => U, params?: any): List<U> =>
    this.map(f, params).filter(i => isDefined(i));

  filter = (p: (value: T, index: number, array: T[]) => unknown, params?: any): List<T> =>
    super.filter(p, params) as List<T>;

  concat = (...items: Array<T>[]): List<T> => super.concat(...items) as List<T>;

  add = (...items: (T | T[])[]): List<T> => this.concat(toArray(...items));
}

export const list = <T>(...items: (T | T[])[]): List<T> => new List<T>(...toArray(...items));
