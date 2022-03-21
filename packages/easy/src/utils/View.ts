import { asJson, isArray, isDefined, isFunction, isObject, isString, Json, json, meta, tryTo } from '../types';
import { traverse } from './Traverse';
import { choose } from './Case';

type Func<T = unknown> = (a: any) => T;

export type InOut = { in?: Func | View, col?: string };

const isColOnly = (v: unknown): v is InOut => isObject(v) && isDefined(v.col) && !isDefined(v.in);
const isInOnly = (v: unknown): v is InOut => isObject(v) && !isDefined(v.col) && isFunction(v.in);
const isColAndFunction = (v: unknown): v is { col: string, in: Func } => isObject(v) && isDefined(v.col) && isFunction(v.in);
const isColAndView = (v: unknown): v is { col: string, in: View } => isObject(v) && isDefined(v.col) && v.in instanceof View;

type Views = { [key: string]: string | Func | InOut };
type Viewer = { in: { key: string, f: Func } };

const toFunc = (a: any, col: string, f: Func = a => a): Func =>
  tryTo(traverse(a, col)).map(v => isArray(v) ? () => v.map(i => f(i)) : (a: any) => f(traverse(a, col))).value;

const toViewer = (key: string, value: unknown): Viewer => choose<Viewer>(value)
  .type(isString, s => toViewer(key, (a: any) => toFunc(a, s)(a)))
  .type(isColOnly, io => toViewer(key, io.col))
  .type(isFunction, f => toViewer(key, { in: { key, f } }))
  .type(isInOnly, io => toViewer(key, { in: { key, f: io.in } }))
  .type(isColAndFunction, io => toViewer(key, { in: { key, f: (a: any) => toFunc(a, io.col, io.in)(a) } }))
  .type(isColAndView, io => toViewer(key, { in: { key, f: (a: any) => toFunc(a, io.col, io.in.from)(a) } }))
  .else(v => v as Viewer);

const toViewers = (views: Views): Viewer[] =>
  meta(views)
    .entries()
    .map(([k, v]) => toViewer(k, v));

export class View {
  constructor(views: Views = {}, readonly startsFrom: 'scratch' | 'source' = 'scratch', readonly viewers: Viewer[] = toViewers(views)) {
  }

  reduce = (i: any): any => this.viewers.reduce((a: any, v) => json.add(a, v.in.key, v.in.f(i)), this.startsFrom === 'scratch' ? {} : i);

  from = (source: unknown): Json[] | Json => tryTo(asJson(source)).map(s => isArray(s) ? s.map(i => this.reduce(i)) : this.reduce(s)).value;
}

export const view = (views: Views, startsFrom?: 'scratch' | 'source'): View => new View(views, startsFrom);