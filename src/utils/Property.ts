import { convert, Convert } from './Convert';
import { Get, isA, List, meta, ofGet } from '../types';
import { InOut } from './InOut';

export type PropertyOptions<T = unknown> = {
  convert?: Convert<any, any>;
  dflt?: Get<T>;
  format?: string;
};

export const toPropertyOptions = (options?: PropertyOptions): PropertyOptions => ({ ...options, convert: options?.convert ?? convert.default });

export class Property<T = unknown> implements InOut {
  constructor(readonly owner: unknown, readonly property: string, readonly options?: PropertyOptions) {
    this.options = toPropertyOptions(options);
  }

  in = (value: unknown): any => this.options?.convert?.to((value as any)[this.property] ?? ofGet(this.options?.dflt));
  out = (value: unknown): any => this.options?.convert?.from(value);
}

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'owner', 'property', 'options');

export const toProperty = <T>(owner: unknown, name: string, options?: PropertyOptions<T>): Property<T> =>
  new Property<T>(owner, name, { ...options, convert: options?.convert ?? convert.default });

export const toProperties = <P extends Property>(owner: unknown): List<[string, P]> =>
  meta(owner)
    .entries<P>()
    .filter(([, v]) => isProperty(v));
