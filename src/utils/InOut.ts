import { Get, isA, isEmpty, json, Json, JsonValue, List, meta, ofGet } from '../types';
import { MapOptions } from './Map';

export type InOut = {
  name: string;
  in: (key: string, source?: Json) => JsonValue | undefined;
  out: (key: string, source?: Json) => JsonValue | undefined;
};

export const isInOut = (io?: unknown): io is InOut => isA<InOut>(io, 'in', 'out');

export class Mapper implements InOut {
  private props?: List<[string, InOut]>;

  constructor(readonly name: string = '', public options: MapOptions = { startFrom: 'scratch' }) {}

  get properties(): List<[string, InOut]> {
    return (
      this.props ??
      (this.props = meta(this)
        .entries<InOut>()
        .filter(([, v]) => isInOut(v)))
    );
  }

  in = (key: string, from: Json = {}): Json =>
    this.properties.reduce(
      (a, [k, p]) =>
        json.omit(
          {
            ...a,
            [k]: p.in(k, { ...a, ...from }),
          },
          p.name
        ),
      this.options.startFrom === 'source' ? from : {}
    );

  out = (key: string, to: Json = {}): Json =>
    this.properties.reduce(
      (a, [k, p]) => {
        return json.omit(json.merge(a, isEmpty(p.name) ? p.out(k, to) : { [p.name]: p.out(k, { ...a, ...to }) }), k);
      },
      this.options.startFrom === 'source' ? to : {}
    );
}

export const inout = {
  prop: (name: string): InOut => ({
    name,
    in: (key: string, source: Json = {}): JsonValue => source[name],
    out: (key: string, source: Json = {}): JsonValue => source[key],
  }),
  ignore: (name: string): InOut => ({
    name,
    in: (): JsonValue | undefined => undefined,
    out: (): JsonValue | undefined => undefined,
  }),
  func: (name: string, funcIn: Get<JsonValue, Json>, funcOut: Get<JsonValue, Json>): InOut => ({
    name,
    in: (key: string, source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (key: string, source: Json = {}): JsonValue => ofGet(funcOut, source),
  }),
  add: (funcIn: Get<JsonValue, Json>): InOut => ({
    name: '',
    in: (key: string, source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (): JsonValue | undefined => undefined,
  }),
  map: (name = '', mapper: Mapper): InOut => ({
    name,
    in: (key: string, source: Json = {}): JsonValue => mapper.in(key, isEmpty(name) ? source : (source[name] as Json)),
    out: (key: string, source: Json = {}): JsonValue => mapper.out(name, isEmpty(key) ? source : (source[key] as Json)),
  }),
};
