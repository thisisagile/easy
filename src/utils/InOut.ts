import { Construct, Get, isA, isEmpty, json, Json, JsonValue, List, meta, ofConstruct, ofGet } from '../types';
import { Property, PropertyOptions } from './Property';

export type MapStartFrom = 'scratch' | 'source';
export type MapOptions = { startFrom: MapStartFrom };

export type InOut = {
  property: string;
  in: (source?: Json, key?: string) => JsonValue | undefined;
  out: (source?: Json, key?: string) => JsonValue | undefined;
};

export const isInOut = (io?: unknown): io is InOut => isA<InOut>(io, 'in', 'out');

export class Mapper implements InOut {
  protected readonly map = maps;
  private props?: List<[string, InOut]>;

  constructor(readonly options: MapOptions = { startFrom: 'scratch' }, readonly property = '') {}

  get properties(): List<[string, InOut]> {
    return (
      this.props ??
      (this.props = meta(this)
        .entries<InOut>()
        .filter(([, v]) => isInOut(v)))
    );
  }

  get keys(): List<string> {
    return this.properties.map(([k]) => k);
  }

  get columns(): List<string> {
    return this.properties.map(([, p]) => p.property ?? '');
  }

  private get dropped(): List<string> {
    return this.columns.filter(c => !this.keys.some(k => k === c));
  }

  in = (from: Json = {}): Json =>
    json.omit(
      this.properties.reduce((a, [k, p]) => json.merge(a, { [k]: p.in({ ...a, ...from }) }), this.options.startFrom === 'source' ? from : {}),
      ...this.dropped
    );

  out = (to: Json = {}): Json =>
    json.omit(
      this.properties.reduce(
        (a, [k, p]) => json.merge(a, isEmpty(p.property) ? p.out(to, k) : { [p.property ?? '']: p.out({ ...a, ...to }, k) }),
        this.options.startFrom === 'source' ? to : {}
      ),
      ...this.keys
    );

  toString(): string {
    return this.constructor.name;
  }
}

export const maps = {
  item: (property: string, options?: PropertyOptions): Property => new Property(property, options),
  ignore: (property = ''): InOut => ({
    property,
    in: (): JsonValue | undefined => undefined,
    out: (): JsonValue | undefined => undefined,
  }),
  func: (property: string, funcIn: Get<JsonValue, Json>, funcOut: Get<JsonValue, Json>): InOut => ({
    property,
    in: (source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (source: Json = {}): JsonValue => ofGet(funcOut, source),
  }),
  add: (funcIn: Get<JsonValue, Json>): InOut => ({
    property: '',
    in: (source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (): JsonValue | undefined => undefined,
  }),
  map: (mapper: Construct<Mapper>, property = ''): InOut => ({
    property,
    in: (source: Json = {}): JsonValue => ofConstruct(mapper).in(isEmpty(property) ? source : (source[property] as Json)),
    out: (source: Json = {}, key = ''): JsonValue => ofConstruct(mapper).out(isEmpty(key) ? source : (source[key] as Json)),
  }),
};
