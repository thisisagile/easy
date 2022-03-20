import { asJson, isFunction, isObject, tryTo } from '../types';

type Func<T = unknown> = (a: any) => T;

export type Viewer = { in?: { key: string, f?: Func }};

export type InOut = { in?: Func | View, col?: string };
export const isInOut = (v: unknown): v is InOut => isObject(v) && (isFunction(v.in) || v.in instanceof View);

type Views = { [key: string]: string | Func | InOut };

export class View {
  constructor(readonly views: Viewer[] = [], readonly startsFrom: 'scratch' | 'source' = 'scratch') {
  }

  from = (source: unknown): unknown => tryTo(asJson(source)).map(s => this.views.reduce((a: any, m) => ({ ...a, ...{ [m.in?.key ?? '']: m.in?.f && m.in.f(s) } }), this.startsFrom === 'scratch' ? {} : s)).value;
}

export const view = (views: Views, startsFrom?: 'scratch' | 'source'): View => new View([], startsFrom);