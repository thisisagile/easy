import { Property, PropertyOptions } from './Property';
import { State } from './State';
import { ifNotEmpty } from './If';
import { json, Json, JsonValue } from '../types/Json';
import { Optional } from '../types/Types';
import { TypeGuard } from '../types/TypeGuard';
import { isA } from '../types/IsA';
import { List, toList } from '../types/List';
import { meta } from '../types/Meta';
import { isEmpty } from '../types/Is';
import { Get, ofGet } from '../types/Get';
import { Construct, ofConstruct } from '../types/Constructor';

export type Mapping = {
  property: string;
  in: (source?: Json, key?: string) => Optional<JsonValue>;
  out: (source?: Json, key?: string) => Optional<JsonValue>;
};
export const isMapping: TypeGuard<Mapping> = (m?: unknown): m is Mapping => isA<Mapping>(m, 'in', 'out');

export type MapStartFrom = 'scratch' | 'source';
export type MapOptions = { startFrom: MapStartFrom };

export class Mapper extends State implements Mapping {
  protected readonly map = mappings;

  constructor(
    readonly options: MapOptions = { startFrom: 'scratch' },
    readonly property = ''
  ) {
    super();
  }

  // All properties that are a mapping
  get properties(): List<[string, Mapping]> {
    return this.get('props', () =>
      meta(this)
        .entries<Mapping>()
        .filter(([, v]) => isMapping(v))
    );
  }

  // All names of properties (in target) that have a Mapping
  get keys(): List<string> {
    return this.get('keys', () => this.properties.map(([k]) => k));
  }

  // All names of properties (in source) that are named in a Mapping
  get columns(): List<string> {
    return this.get('columns', () => this.properties.mapDefined(([, p]) => ifNotEmpty(p.property, p.property))).distinct();
  }

  // All names of properties (in source) that are NOT properties in target
  private get droppedIn(): List<string> {
    return this.get('droppedIn', () => this.columns.filter(c => !this.keys.some(k => k === c)));
  }

  // All names op properties (in target) that are NOT properties in source
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
    in: (): Optional<JsonValue> => undefined,
    out: (): Optional<JsonValue> => undefined,
  }),
  skipIn: (property: string): Mapping => ({
    property,
    in: (): Optional<JsonValue> => undefined,
    out: (source: Json = {}): JsonValue => source[property],
  }),
  skipOut: (property: string): Mapping => ({
    property,
    in: (source: Json = {}): JsonValue => source[property],
    out: (): Optional<JsonValue> => undefined,
  }),
  func: (property: string, funcIn: Get<Optional<JsonValue>, Json>, funcOut: Get<Optional<JsonValue>, Json>): Mapping => ({
    property,
    in: (source: Json = {}): Optional<JsonValue> => ofGet(funcIn, source),
    out: (source: Json = {}): Optional<JsonValue> => ofGet(funcOut, source),
  }),
  add: (funcIn: Get<JsonValue, Json>): Mapping => ({
    property: '',
    in: (source: Json = {}): JsonValue => ofGet(funcIn, source),
    out: (): Optional<JsonValue> => undefined,
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
