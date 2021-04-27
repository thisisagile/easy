import { Construct, isEmpty, json, Json, List, ofConstruct, ofGet } from '../types';
import { Property, PropertyOptions, toProperties, toProperty } from './Property';
import { convert } from './Convert';

export type MapStartFrom = 'scratch' | 'source';
export type MapOptions = { startFrom: MapStartFrom };

export class MapProperty extends Property {
  constructor(owner: unknown, name = '', readonly m: Construct<Map>) {
    super(owner, name, {});
  }

  in = (value: unknown): any => ofConstruct(this.m).in(this.val(value)) ?? ofGet(this.options?.dflt);

  out = (value: unknown): any => ofConstruct(this.m).out(this.val(value));

  private val = (value: unknown): any => (isEmpty(this.property) ? value : (value as any)[this.property]);
}

export class Map<P extends Property = Property> {
  constructor(public options: MapOptions = { startFrom: 'scratch' }, private props?: List<[string, P]>) {}

  get properties(): List<[string, P]> {
    return this.props ?? (this.props = toProperties(this));
  }

  get keys(): List<string> {
    return this.properties.map(([k]) => k);
  }

  get columns(): List<string> {
    return this.properties.map(([, p]) => p.property);
  }

  private get dropped(): List<string> {
    return this.columns.filter(c => !this.keys.some(k => k === c));
  }

  toString(): string {
    return this.constructor.name;
  }

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Property => toProperty(this, name, options);

  map = <T = unknown>(map: Construct<Map>, name = ''): Property => new MapProperty(this, name, map);

  get ignore(): Property {
    return toProperty(this, '', { convert: convert.ignore });
  }

  in = (from: Json = {}): Json =>
    json.omit(
      this.properties.reduce((a, [k, p]) => ({ ...a, [k]: p.in(from) }), this.options.startFrom === 'source' ? from : {}),
      ...this.dropped
    );

  out = (to: Json = {}): Json =>
    json.omit(
      this.properties.reduce((a, [k, p]) => ({ ...a, [p.property]: p.out(to[k]) }), this.options.startFrom === 'source' ? to : {}),
      ...this.keys
    );
}
