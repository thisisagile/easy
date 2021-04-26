import { Get, isA, isEmpty, json, Json, JsonValue, List, meta, ofGet } from '../types';
import { MapOptions } from './Map';
import { PropertyOptions, toPropertyOptions } from './Property';

export type InOut = {
  property?: string;
  in: (source?: Json, key?: string) => JsonValue | undefined;
  out: (source?: Json, key?: string) => JsonValue | undefined;
};

export const isInOut = (io?: unknown): io is InOut => isA<InOut>(io, 'in', 'out');

export class Mapper implements InOut {
  public readonly map = maps;
  private props?: List<[string, InOut]>;

  constructor(public options: MapOptions = { startFrom: 'scratch' }) {
  }

  get properties(): List<[string, InOut]> {
    return (
      this.props ??
      (this.props = meta(this)
        .entries<InOut>()
        .filter(([, v]) => isInOut(v)))
    );
  }

  in = (from: Json = {}): Json =>
    this.properties.reduce(
      (a, [k, p]) => json.omit({ ...a, [k]: p.in({ ...a, ...from }, k) }, p?.property ?? ''),
      this.options.startFrom === 'source' ? from : {},
    );

  out = (to: Json = {}): Json =>
    this.properties.reduce(
      (a, [k, p]) => {
        return json.omit(json.merge(a, isEmpty(p.property) ? p.out(to, k) : { [p.property ?? '']: p.out({ ...a, ...to }, k) }), k);
      },
      this.options.startFrom === 'source' ? to : {},
    );

  toString(): string {
    return this.constructor.name;
  }
}

export const maps = {
  item: (property: string, options?: PropertyOptions, opts = toPropertyOptions(options)): InOut => ({
    property,
    in: (source: Json = {}): JsonValue => opts.convert?.to(source[property] ?? ofGet(options?.dflt)),
    out: (source: Json = {}, key = ''): JsonValue => opts.convert?.from(source[key]),
  }),
  ignore: (property: string): InOut => ({
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
  map: (property = '', mapper: Mapper): InOut => ({
    property,
    in: (source: Json = {}): JsonValue => mapper.in(isEmpty(property) ? source : (source[property] as Json)),
    out: (source: Json = {}, key = ''): JsonValue => mapper.out(isEmpty(key) ? source : (source[key] as Json)),
  }),
};
