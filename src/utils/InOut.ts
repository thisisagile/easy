import { Get, isA, isEmpty, json, Json, JsonValue, List, meta, ofGet } from '../types';
import { MapOptions } from './Map';
import { PropertyOptions, toPropertyOptions } from './Property';

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
