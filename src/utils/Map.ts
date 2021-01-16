import { isDefined, Json, List, meta } from '../types';
import { isProperty, Property, PropertyOptions, toProperty } from './Property';

export const clone = (subject: Json, key: string, name: string, def: unknown, convert: (x: unknown) => unknown): Json => {
  if (key === name) return subject;
  const value = subject[name] ?? def;
  if (isDefined(value)) (subject as any)[key] = convert(value);
  delete subject[name];
  return subject;
};

export class Map {
  get properties(): List<[string, Property]> {
    return meta(this)
      .entries<Property>()
      .filter(([, v]) => isProperty(v));
  }

  toString(): string {
    return this.constructor.name;
  }

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Property => toProperty(this, name, options);

  in = (from?: Json): Json =>
    this.properties.reduce((a: any, [k, v]: [string, Property]) => clone(a, k, v.name, v.options.def, v.options.convert.to), { ...from });
  out = (to?: Json): Json => this.properties.reduce((a: any, [k, v]: [string, Property]) => clone(a, v.name, k, undefined, v.options.convert.from), { ...to });
}
