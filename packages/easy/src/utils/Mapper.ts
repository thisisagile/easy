import { Construct, Get, isA, isEmpty, json, Json, JsonValue, List, meta, ofConstruct, ofGet, toList } from '../types';
import { Property, PropertyOptions } from './Property';
import { State } from './State';

export type Mapping = {
  property: string;
  in: (source?: Json, key?: string) => JsonValue | undefined;
  out: (source?: Json, key?: string) => JsonValue | undefined;
};
export const isMapping = (m?: unknown): m is Mapping => isA<Mapping>(m, 'in', 'out');

export type MapStartFrom = 'scratch' | 'source';
export type MapOptions = { startFrom: MapStartFrom };

export class Mapper extends State implements Mapping {
  protected readonly map = mappings;

  constructor(readonly options: MapOptions = { startFrom: 'scratch' }, readonly property = '') {
    super();
  }

  get properties(): List<[string, Mapping]> {
    return this.get('props', () =>
      meta(this)
        .entries<Mapping>()
        .filter(([, v]) => isMapping(v))
    );
  }

  get keys(): List<string> {
    return this.get('keys', () => this.properties.map(([k]) => k));
  }

  get columns(): List<string> {
    return this.get('columns', () => this.properties.map(([, p]) => p.property ?? ''));
  }

  private get droppedIn(): List<string> {
    return this.get('droppedIn', () => this.columns.filter(c => !this.keys.some(k => k === c)));
  }

  private get droppedOut(): List<string> {
    return this.get('droppedOut', () => this.properties.filter(([, p]) => !this.keys.some(k => k === p.property ?? '')).map(([k]) => k));
  }

  public in(from: Json = {}): Json {
    return json.omit(
      this.properties.reduce((a, [k, p]) => json.merge(a, { [k]: p.in({ ...a, ...from }) }), this.options.startFrom === 'source' ? from : {}),
      ...this.droppedIn
    );
  }

  public out(to: Json = {}): Json {
    return json.omit(
      this.properties.reduce(
        (a, [k, p]) => json.merge(a, isEmpty(p.property) ? p.out(to, k) : { [p.property ?? '']: p.out({ ...a, ...to }, k) }),
        this.options.startFrom === 'source' ? to : {}
      ),
      ...this.droppedOut
    );
  }

  toString(): string {
    return this.constructor.name;
  }
}

export const mappings = {
  item: (property: string, options?: PropertyOptions): Property => new Property(property, options),
  ignore: (property = ''): Mapping => ({
    property,
    in: (): JsonValue | undefined => undefined,
    out: (): JsonValue | undefined => undefined,
  }),
  skip: (property = ''): Mapping => mappings.ignore(property),
  func: (property: string, funcIn: Get<JsonValue | undefined, Json>, funcOut: Get<JsonValue | undefined, Json>): Mapping => ({
    property,
    in: (source: Json = {}): JsonValue | undefined => ofGet(funcIn, source),
    out: (source: Json = {}): JsonValue | undefined => ofGet(funcOut, source),
  }),
  add: (funcIn: Get<JsonValue, Json>): Mapping => ({
    property: '',
    in: (source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (): JsonValue | undefined => undefined,
  }),
  map: (mapper: Construct<Mapper>, property = ''): Mapping => ({
    property,
    in: (source: Json = {}): JsonValue => ofConstruct(mapper).in(isEmpty(property) ? source : (source[property] as Json)),
    out: (source: Json = {}, key = ''): JsonValue => ofConstruct(mapper).out(isEmpty(key) ? source : (source[key] as Json)),
  }),
  propsToList: (...maps: Mapping[]): Mapping => ({
    property: '',
    in: (source: Json = {}): JsonValue => toList(maps.map(m => ofConstruct(m).in(source))).toJSON(),
    out: (source: Json = {}, key = ''): JsonValue =>
      maps.reduce((a: Json, m, i) => {
        const res = toList(source[key])[i];
        const out = m.out(res as Json);
        return { ...a, [m.property]: out ?? {} };
      }, {}),
  }),

  list: (mapper: Mapping, property: string): Mapping => ({
    property: property,
    in: (source: Json = {}): JsonValue =>
      toList(source[property])
        .map((v: any) => mapper.in(v))
        .toJSON(),
    out: (source: Json = {}, key = ''): JsonValue =>
      toList(isEmpty(key) ? source : (source[key] as Json))
        .map((v: any) => mapper.out(v))
        .toJSON(),
  }),
};
