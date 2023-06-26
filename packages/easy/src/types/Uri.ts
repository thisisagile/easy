import { isBoolean, isDefined, isNotEmpty, isTrue } from './Is';
import { asString, Text } from './Text';
import { toName } from './Constructor';
import { ctx } from './Context';
import { List, toList } from './List';
import { meta } from './Meta';
import { tryTo } from './Try';
import { Optional } from './Types';
import { OneOrMore, toArray } from './Array';

export type Segment = Text & { key?: string; segment?: string; query?: (value: unknown) => string };

export const toSegment = (
  key?: Text,
  {
    segment,
    query,
  }: {
    segment?: string;
    query?: (value: unknown) => string;
  } = {}
): Segment => ({
  key: key as string,
  segment,
  query,
  toString: () => asString(key),
});

export const uri = {
  host: (key?: string): Segment => toSegment(key, { segment: key ?? ctx.env.host ?? '$host' }),
  resource: (resource: Uri): Segment => toSegment(toName(resource, 'Uri'), { segment: toName(resource, 'Uri') }),
  segment: (key?: Text): Segment => toSegment(key, { segment: key as string }),
  path: (key: Text): Segment => toSegment(key, { segment: `:${key}` }),
  query: (key: Text): Segment => toSegment(key, { query: (value: unknown): string => (isDefined(value) ? `${key}=${value}` : '') }),
  boolean: (key: Text): Segment => toSegment(key, { query: (value: unknown): string => (isTrue(value) ? `${key}` : '') }),
};

type Prop = { segment: Segment; value: any };

const toRoute = (...segments: Segment[]): string =>
  toList(segments)
    .mapDefined(s => s.segment)
    .join('/');

export type Uri = {
  id: (id?: unknown) => Uri;
  ids: (ids: OneOrMore<unknown>) => Uri;
  query: (q?: unknown) => Uri;
  skip: (n?: number) => Uri;
  take: (n?: number) => Uri;
  path: string;
  route: (resource: string) => string;
  isInternal: boolean;
  toString: () => string;
};

export type UriExpandProps = { q: string };

export class EasyUri<Props = UriExpandProps> implements Uri {
  static readonly id = uri.path('id');
  static readonly ids = uri.query('ids');
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

  route = (resource: Optional<string> = this.resource.key): string => toRoute(uri.segment(''), uri.segment(resource?.toLowerCase()), ...this.segments);

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
      .map(route => ({
        route,
        query: this.props.mapDefined(p => (p.segment?.query ? p.segment?.query(p.value) : undefined))?.join('&'),
      }))
      .map(({ route, query }) => (isNotEmpty(query) ? `${route}?${query}` : route)).value;
  }

  id = (id?: unknown): this => this.set(EasyUri.id, id);
  ids = (ids: OneOrMore<unknown>): this => this.set(EasyUri.ids, toArray(ids).join(','));
  query = (q?: unknown): this => this.set(EasyUri.query, q);

  skip = (index?: number): this => this.set(EasyUri.skip, index);
  take = (items?: number): this => this.set(EasyUri.take, items);

  expand(props: Partial<Props>): this {
    return meta(props)
      .entries()
      .reduce((u, [k, v]) => (isBoolean(v) ? u.set(uri.boolean(k), v) : u.set(uri.query(k), toArray(v).join(','))), this);
  }
}
