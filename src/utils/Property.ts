import { convert, Convert } from './Convert';
import { Get, isA, List, meta, ofGet } from '../types';

export type PropertyOptions<T = unknown> = { dflt?: Get<T>; convert?: Convert<any, any>; format?: string };

export class Property<T = unknown> {
  constructor(readonly owner: unknown, readonly name: string, readonly options: PropertyOptions = {}) {}

  in = (value: any): any => this.options?.convert?.to(value[this.name] ?? ofGet(this.options?.dflt));

  out = (value: unknown): any => this.options?.convert?.from(value);
}

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'owner', 'name', 'options');

export const toProperty = <T>(owner: unknown, name: string, options?: PropertyOptions<T>): Property<T> =>
  new Property<T>(owner, name, { dflt: options?.dflt, convert: options?.convert ?? convert.default });

export const toProperties = <P extends Property>(owner: unknown): List<[string, P]> =>
  meta(owner)
    .entries<P>()
    .filter(([, v]) => isProperty(v));
