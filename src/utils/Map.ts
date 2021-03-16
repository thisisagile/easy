import { Json, List } from '../types';
import { clone, Property, PropertyOptions, toProperties, toProperty } from './Property';

export class Map<P extends Property = Property> {
  get properties(): List<[string, P]> {
    return toProperties(this);
  }

  toString(): string {
    return this.constructor.name;
  }

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Property => toProperty(this, name, options);

  in = (from: Json = {}): Json => this.properties.reduce((a: any, [k, p]: [string, P]) => clone(a, p.name, k, p.options?.def, p.options?.convert?.to), from);
  out = (to: Json = {}): Json => this.properties.reduce((a: any, [k, p]: [string, P]) => clone(a, k, p.name, undefined, p.options?.convert?.from), to);
}
