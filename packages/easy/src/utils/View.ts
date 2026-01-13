import { traverse } from './Traverse';
import { ifDefined } from './If';
import { Primitive } from '../types/Primitive';
import { Constructor, isConstructor, use } from '../types/Constructor';
import { asJson, json as typesJson } from '../types/Json';
import { choose } from '../types/Case';
import { isArray, isBoolean, isFunction, isString } from '../types/Is';
import { meta } from '../types/Meta';
import { isPageList, PageList, toPageList } from '../types/PageList';
import { List } from '../types/List';
import { isEqual } from '../types/IsEqual';
import { DontInfer } from '../types/Types';
import { EnumConstructor, isEnumConstructor } from '../types/Enum';
import { Id } from '../types/Id';

type Func<T = unknown> = (a: any, key?: string) => T;
type Viewer = { key: string; f: Func };

type ViewType<V = any> = Primitive | EnumConstructor | Constructor | Func | View<V> | undefined;
type ViewRecord<V = any> = Partial<Record<keyof V, ViewType>>;

const ignore = Symbol('view.ignore');
const keep = Symbol('view.keep');
const json = Symbol('view.json');
const spread = 'view.spread';

export const toViewer = (key: string, value: ViewType): Viewer =>
  choose(value)
    .is.not.defined(v => v, { key, f: () => undefined } as Viewer)
    .type(isBoolean, b => ({ key, f: () => b }))
    .equals(ignore, { key, f: () => undefined })
    .equals(keep, { key, f: (a: any) => traverse(a, key) })
    .equals(json, { key, f: (a: any) => asJson(traverse(a, key)) })
    .type(isString, s => ({ key, f: (a: any) => traverse(a, s) }))
    .type(isEnumConstructor, c => ({
      key,
      f: (a, key) => use(traverse(a, key), v => (isArray(v) ? c.byIds(v) : c.byId(v as Id))),
    }))
    .type(isConstructor, c => ({
      key,
      f: (a, key) => use(traverse(a, key), v => (isArray(v) ? v.map(i => optional(c, i)) : optional(c, v))),
    }))
    .type(isSimpleView, f => ({ key, f: (a: any) => ifDefined(traverse(a, key), v => f.from(v)) }))
    .type(isFunction, f => ({ key, f }))
    .else(v => ({ key, f: () => v }));

const optional = (c: Constructor, v: any) =>
  ifDefined(
    v,
    i => new c(i),
    () => v
  );

const toViewers = (views: ViewRecord): Viewer[] =>
  meta(views)
    .entries<ViewType>()
    .map(([k, v]) => toViewer(k, v));

export class View<V = any> {
  constructor(
    private views = {} as ViewRecord<V>,
    readonly startsFrom: 'scratch' | 'source' = 'scratch',
    readonly viewers: Viewer[] = toViewers(views)
  ) {}

  get fromSource(): View<V> {
    return new View(this.views, 'source', this.viewers);
  }

  from<T = unknown>(source: PageList<T>): PageList<V>;
  from<T = unknown>(source: List<T>): List<V>;
  from<T = unknown>(source: T[]): V[];
  from<T = unknown>(source: T): V;
  from<T = unknown>(source: PageList<T> | List<T> | T[] | T): PageList<V> | List<V> | V[] | V {
    if (isPageList(source))
      return toPageList(
        source.map(s => this.reduce(s)),
        source.options
      );
    if (isArray(source)) return source.map(s => this.reduce(s));
    return this.reduce(source);
  }

  same = (one?: unknown, another?: unknown): boolean => isEqual(this.from(one), this.from(another));

  private reduce = (source: any): any =>
    use(asJson(source), src =>
      this.viewers.reduce(
        (acc, v) => (v.key === spread ? { ...acc, ...asJson(v.f(src, v.key)) } : typesJson.set(acc, v.key, v.f(src, v.key))),
        this.startsFrom === 'scratch' ? {} : src
      )
    );
}

export const isSimpleView = (a: unknown): a is View => a instanceof View;

export const view = <V = any>(views: ViewRecord<DontInfer<V>>): View<V> => new View<V>(views);

export const views = {
  ignore,
  keep,
  json,
  spread,
  skip: ignore,
  value: (value: unknown) => () => value,
  or: {
    key: (altKey: string) => (a: unknown, key?: string) => traverse(a, key) ?? traverse(a, altKey),
    value: (altValue: unknown) => (a: unknown, key?: string) => traverse(a, key) ?? altValue,
    func: (altFunc: Func) => (a: unknown, key?: string) => traverse(a, key) ?? altFunc(a, key),
  },
};

// spread: (a: any, key: string) => ({...a, ...(use(traverse(a, key), v => isObject(v) ? v : ({[key]: v})))}),
