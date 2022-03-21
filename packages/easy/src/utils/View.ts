import { asJson, isArray, isDefined, isFunction, isObject, isString, meta, tryTo } from '../types';
import { traverse } from './Traverse';
import { choose } from './Case';

type Func<T = unknown> = (a: any) => T;

export type InOut = { in?: Func | View, col?: string };
export const isColOnly = (v: unknown): v is InOut => isObject(v) && isDefined(v.col) && !isDefined(v.in);
export const isInOnly = (v: unknown): v is InOut => isObject(v) && !isDefined(v.col) && isFunction(v.in);
export const isInOutWithFunction = (v: unknown): v is { col: string, in: Func } => isObject(v) && isDefined(v.col) && isFunction(v.in);
export const isInOutWithView = (v: unknown): v is { col: string, in: View } => isObject(v) && isDefined(v.col) && v.in instanceof View;

export type Views = { [key: string]: string | Func | InOut };
export type Viewer = { in?: { key: string, f?: Func } };

const toFunc = (a: any, col: string, f: Func = a => a): Func =>
  tryTo(traverse(a, col))
    .map(v => isArray(v) ? () => v.map(i => f(i)):  (a: any) => f(traverse(a, col)))
    .value;

const toViewer = (key: string, value: unknown): Viewer => {
  const k = key;
  const v = value;
  return choose<Viewer>(value)
    .type(isString, s => toViewer(key, (a: any) => toFunc(a, s)(a)))
    .type(isColOnly, io => toViewer(key, io.col))
    .type(isFunction, f => toViewer(key, { in: { key, f } }))
    .type(isInOnly, io => toViewer(key, { in: { key, f: io.in } }))
    .type(isInOutWithFunction, io => toViewer(key, { in: { key, f: (a: any) => toFunc(a, io.col, io.in)(a) } }))
    .type(isInOutWithView, io => toViewer(key, { in: { key, f: (a: any) => toFunc(a, io.col, io.in.from)(a) } }))
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