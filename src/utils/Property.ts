import { convert, Convert } from './Convert';
import { Get, isA, Json, JsonValue, List, meta, ofGet } from '../types';
import { InOut } from './InOut';

export type PropertyOptions<T = unknown> = {
  convert?: Convert<any, any>;
  dflt?: Get<T>;
  format?: string;
};

export const toPropertyOptions = (options?: PropertyOptions): PropertyOptions => ({ ...options, convert: options?.convert ?? convert.default });

export class Property<T = unknown> implements InOut {
  constructor(readonly property: string, readonly options?: PropertyOptions) {
    this.options = toPropertyOptions(options);
  }

  in = (source: Json = {}): JsonValue => this.options?.convert?.to(source[this.property] ?? ofGet(this.options?.dflt));
  out = (source: Json = {}, key = ''): JsonValue => this.options?.convert?.from(source[key]);
}

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'property', 'options');

export const toProperty = <T>(name: string, options?: PropertyOptions<T>): Property<T> =>
  new Property<T>(name, { ...options, convert: options?.convert ?? convert.default });

export const toProperties = <P extends Property>(owner: unknown): List<[string, P]> =>
  meta(owner)
    .entries<P>()
    .filter(([, v]) => isProperty(v));
