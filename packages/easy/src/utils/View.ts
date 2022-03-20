type Func<T = unknown> = (a: any) => T;
export type Viewer = { in?: { key: string, f?: Func }, out?: { key: string, f?: Func } };

type InOut = { in?: Func | View, out?: Func | View, col?: string };
type Views = { [key: string]: string | Func | InOut };


export class View {
  constructor(readonly views: Viewer[] = [], readonly from: 'scratch' | 'source' = 'scratch') {
  }
}

export const view = (map: Views, from?: 'scratch' | 'source'): View => new View([], from);