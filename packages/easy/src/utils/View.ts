import { tryTo } from '../types';
import { asJson } from '@thisisagile/easy-test/dist/utils/Utils';

type Func<T = unknown> = (a: any) => T;
export type Viewer = { in?: { key: string, f?: Func }, out?: { key: string, f?: Func } };

type InOut = { in?: Func | View, out?: Func | View, col?: string };
type Views = { [key: string]: string | Func | InOut };


export class View {
  constructor(readonly views: Viewer[] = [], readonly from: 'scratch' | 'source' = 'scratch') {
  }

  in = (source: unknown): unknown => tryTo(asJson(source)).map(s => this.views.reduce((a: any, m) => ({ ...a, ...{ [m.in?.key ?? '']: m.in?.f && m.in.f(s) } }), this.from === 'scratch' ? {} : s)).value;
}

export const view = (map: Views, from?: 'scratch' | 'source'): View => new View([], from);