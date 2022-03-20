import { asJson, isDefined, isFunction, isObject, isString, meta, tryTo } from '../types';
import { traverse } from './Traverse';
import { choose } from './Case';

type Func<T = unknown> = (a: any) => T;

export type InOut = { in?: Func | View, col?: string };
export const isInOut = (v: unknown): v is InOut => isObject(v) && (isDefined(v.col) || isFunction(v.in) || v.in instanceof View);
export const isColOnly = (v: unknown): v is InOut => isObject(v) && isDefined(v.col) && !isDefined(v.in);
export const isInOnly = (v: unknown): v is InOut => isObject(v) && !isDefined(v.col) && isFunction(v.in);

export type Views = { [key: string]: string | Func | InOut };
export type Viewer = { in?: { key: string, f?: Func } };

const toFunc = (a: unknown, key: string, io: InOut): Func =>
  choose<Func, InOut>(io)
    .case(i => isDefined(i.col) && !isDefined(i.in), (i: InOut) => (a: any) => traverse(a, i.col))
    .else(() => undefined);

const toViewer = (key: string, value: unknown): Viewer => {
  console.log(key, value);
  return choose<Viewer>(value)
    .type(isString, s => toViewer(key, (a: any) => traverse(a, s)))
    .type(isColOnly, io => toViewer(key, io.col))
    .type(isFunction, f => toViewer(key, { in: { key, f } }))
    .type(isInOnly, io => toViewer(key, { in: { key, f: io.in } }))
    // .type(isInOut, io => toViewer(key, (a: any) => toFunc(a, key, io)(a)))
    .else(m => m as Viewer);
};

export const toViewers = (views: Views): Viewer[] =>
  meta(views)
    .entries()
    .map(([k, v]) => toViewer(k, v));

export class View {
  constructor(views: Views = {}, readonly startsFrom: 'scratch' | 'source' = 'scratch', readonly viewers: Viewer[] = toViewers(views)) {
  }

  from = (source: unknown): unknown => tryTo(asJson(source)).map(s => this.viewers.reduce((a: any, m) => ({ ...a, ...{ [m.in?.key ?? '']: m.in?.f && m.in.f(s) } }), this.startsFrom === 'scratch' ? {} : s)).value;
}


export const view = (views: Views, startsFrom?: 'scratch' | 'source'): View => new View(views, startsFrom);