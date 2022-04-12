import {
  asJson,
  isArray,
  isDefined,
  isFunction, isNumber,
  isObject,
  isString,
  isUndefined,
  Json,
  json,
  meta,
  tryTo,
} from '../types';
import { traverse } from './Traverse';
import { choose } from './Case';

type Func<T = unknown> = (a: any, key?: string) => T;

export type InOut = { in?: Func | View; col?: string };

const isColOnly = (v: unknown): v is InOut => isObject(v) && isDefined(v.col) && !isDefined(v.in);
const isInOnly = (v: unknown): v is InOut => isObject(v) && !isDefined(v.col) && isFunction(v.in);
const isColAndFunction = (v: unknown): v is { col: string; in: Func } => isObject(v) && isDefined(v.col) && isFunction(v.in);
const isColAndView = (v: unknown): v is { col: string; in: View } => isObject(v) && isDefined(v.col) && v.in instanceof View;

type Views = { [key: string]: string | Func | InOut | number | undefined };
type Viewer = { in: { key: string; f: Func } };

const toFunc = (a: any, col: string, f: Func = a => a): Func =>
  tryTo(traverse(a, col)).map(v => (isArray(v) ? () => v.map(i => f(i)) : (a: any) => f(traverse(a, col)))).value;

const toViewer = (key: string, value: unknown): Viewer =>
  choose<Viewer>(value)
    .type(isUndefined, () => toViewer(key, () => undefined))
    .type(isNumber, n => toViewer(key, () => n))
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
  constructor(private views: Views = {}, readonly startsFrom: 'scratch' | 'source' = 'scratch', readonly viewers: Viewer[] = toViewers(views)) {}

  get fromSource(): View {
    return new View(this.views, 'source', this.viewers);
  }

  from = (source: unknown): Json => (isArray(source) ? source.map(s => this.reduce(asJson(s))) : this.reduce(asJson(source)));

  private reduce = (i: any): any => this.viewers.reduce((a: any, v) => json.set(a, v.in.key, v.in.f(i, v.in.key)), this.startsFrom === 'scratch' ? {} : i);
}

export const skip = () => undefined;
export const view = (views: Views): View => new View(views);

export const views = {
  ignore: () => undefined,
  keep: (a: unknown, key?: string) => traverse(a, key),
  keepOr: (alt?: string) => (a: unknown, key?: string) => traverse(a, key) ?? alt,
  or: (key: string, alt = '') => (a: unknown) => traverse(a, key) ?? alt,
  value: (value: unknown) => () => value,
};
