import { isDefined, isNotEmpty } from './Is';
import { asString, Text } from './Text';
import { toName } from './Constructor';
import { ctx } from './Context';
import { List, toList } from './List';
import { meta } from './Meta';
import { tryTo } from './Try';

export type Segment = Text & { key?: string; segment?: string; query?: (value: unknown) => string };

const toSegment = (key?: Text, { segment, query }: { segment?: string; query?: (value: unknown) => string } = {}): Segment => ({
  key: asString(key),
  segment,
  query,
  toString: () => asString(key),
});

export const uri = {
  host: (key?: string): Segment => toSegment(key, { segment: key ?? ctx.env.host ?? '$host' }),
  resource: (resource: Uri): Segment => toSegment(toName(resource, 'Uri'), { segment: toName(resource, 'Uri') }),
  segment: (key?: Text): Segment => toSegment(key, { segment: asString(key) }),
  path: (key: Text): Segment => toSegment(key, { segment: `:${key}` }),
  query: (key: Text): Segment => toSegment(key, { query: (value: unknown): string => (isDefined(value) ? `${key}=${value}` : '') }),
};

type Prop = { segment: Segment; value: any };

const toRoute = (...segments: Segment[]): string =>
  toList(segments)
    .mapDefined(s => s.segment)
    .join('/');

export type Uri = {
  id: (id?: unknown) => Uri;
  query: (q?: unknown) => Uri;
  skip: (n?: number) => Uri;
  take: (n?: number) => Uri;
  path: string;
  route: (resource: string) => string;
  isInternal: boolean;
  toString: () => string;
};

export class EasyUri implements Uri {
  static readonly id = uri.path('id');
  static readonly query = uri.query('q');
  static readonly skip = uri.query('skip');
  static readonly take = uri.query('take');

  readonly host = uri.host();
  readonly resource = uri.resource(this);

  protected state: any = {};

  constructor(readonly segments: Segment[] = []) {}

  get path(): string {
    return toRoute(uri.segment(''), this.resource, ...this.segments);
  }

  get complete(): string {
    return toRoute(this.host, this.resource, ...this.segments);
  }

  get isInternal(): boolean {
    return toRoute(this.host) === (ctx.env.host ?? '$host');
  }

  protected get props(): List<Prop> {
    return meta(this.state).values<Prop>();
  }

  route = (resource: string | undefined = this.resource.key): string => toRoute(uri.segment(''), uri.segment(resource?.toLowerCase()), ...this.segments);

  set = (segment: Segment, value?: unknown): this => {
    tryTo(value)
      .is.defined()
      .accept(value => (this.state[segment.key ?? ''] = { segment, value }));
    return this;
  };

  toString(): string {
    return tryTo(() => this.props)
      .map(ps => ps.filter(p => p.segment?.segment))
      .map(ps => ps.reduce((r: string, p: Prop) => r.replace(asString(p.segment.segment), asString(p.value)), this.complete))
      .map(route => ({ route, query: this.props.mapDefined(p => (p.segment?.query ? p.segment?.query(p.value) : undefined))?.join('&') }))
      .map(({ route, query }) => (isNotEmpty(query) ? `${route}?${query}` : route)).value;
  }

  id = (id?: unknown): this => this.set(EasyUri.id, id);
  query = (q?: unknown): this => this.set(EasyUri.query, q);

  skip = (index?: number): this => this.set(EasyUri.skip, index);
  take = (items?: number): this => this.set(EasyUri.take, items);
}
