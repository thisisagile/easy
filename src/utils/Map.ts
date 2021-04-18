import { json, Json, List } from '../types';
import { Property, PropertyOptions, toProperties, toProperty } from './Property';
import { convert } from './Convert';

export class Map<P extends Property = Property> {
  constructor(private props?: List<[string, P]>) {}

  readonly clear = false;

  get properties(): List<[string, P]> {
    return this.props ?? (this.props = toProperties(this));
  }

  get keys(): List<string> {
    return this.properties.map(([k]) => k);
  }

  get columns(): List<string> {
    return this.properties.map(([, p]) => p.name);
  }

  private get dropped(): List<string> {
    return this.columns.filter(c => !this.keys.some(k => k === c));
  }

  toString(): string {
    return this.constructor.name;
  }

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Property => toProperty(this, name, options);
  get ignore(): Property {
    return toProperty(this, '', { convert: convert.ignore });
  }

  in = (from: Json = {}): Json =>
    json.omit(
      this.properties.reduce((a, [k, p]) => ({ ...a, [k]: p.in(a) }), this.clear ? {} : from),
      ...this.dropped
    );

  out = (to: Json = {}): Json =>
    json.omit(
      this.properties.reduce((a, [k, p]) => ({ ...a, [p.name]: p.out(a[k]) }), this.clear ? {} : to),
      ...this.keys
    );
}
