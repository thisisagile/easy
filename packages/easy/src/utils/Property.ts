import { convert, Convert } from './Convert';
import { Mapping } from './Mapper';
import { Get, ofGet } from '../types/Get';
import { Json, JsonValue } from '../types/Json';

export type PropertyOptions<T = unknown> = {
  convert?: Convert<any, any>;
  dflt?: Get<T>;
  format?: string;
};

export class Property<T = unknown> implements Mapping {
  constructor(
    readonly property: string,
    readonly options?: PropertyOptions
  ) {
    this.options = { ...options, convert: options?.convert ?? convert.default };
  }

  in = (source: Json = {}): JsonValue => this.options?.convert?.to(source[this.property] ?? ofGet(this.options?.dflt));
  out = (source: Json = {}, key = ''): JsonValue => this.options?.convert?.from(source[key]);

  toString() {
    return this.property;
  }
}
