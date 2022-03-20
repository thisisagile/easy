import { asJson, isFunction, isObject, meta, tryTo } from '../types';

type Func<T = unknown> = (a: any) => T;

export type InOut = { in?: Func | View, col?: string };
export const isInOut = (v: unknown): v is InOut => isObject(v) && (isFunction(v.in) || v.in instanceof View);

export type Views = { [key: string]: string | Func | InOut };
export type Viewer = { in?: { key: string, f?: Func }};

export const toViewers = (views: Views): Viewer[] =>
  meta(views)
    .entries()
    .map(([key, v]) => ({in: {key, f: a => a[v as string]}}));

export class View {
  constructor(views: Views = {}, readonly startsFrom: 'scratch' | 'source' = 'scratch', readonly viewers: Viewer[] = toViewers(views)) {
  }

  from = (source: unknown): unknown => tryTo(asJson(source)).map(s => this.viewers.reduce((a: any, m) => ({ ...a, ...{ [m.in?.key ?? '']: m.in?.f && m.in.f(s) } }), this.startsFrom === 'scratch' ? {} : s)).value;
}


export const view = (views: Views, startsFrom?: 'scratch' | 'source'): View => new View(views, startsFrom);