import { isNotEmpty } from './Is';
import { list } from './List';
import { Text } from './Text';
import { toName } from './Constructor';
import { ctx } from './Context';

export type Segment = Text & { key: string; segment?: string; query?: (value: unknown) => string };

const toSegment = (key: string, { segment, query }: { segment?: string; query?: (value: unknown) => string } = {}): Segment => ({
  key,
  segment: segment ?? key,
  query,
  toString: () => key,
});

export const uri = {
  host: (key?: string): Segment => toSegment(key, { segment: key ?? ctx.env.host ?? '$host' }),
  resource: (resource: Uri): Segment => toSegment(toName(resource, 'Uri')),
  segment: (key?: string): Segment => toSegment(key),
  path: (key: string): Segment => toSegment(key, { segment: `:${key}` }),
  query: (key: string): Segment => toSegment(key, { query: (value: unknown): string => (value ? `${key}=${value}` : undefined) }),
};

type Prop = { segment: Segment; value: unknown };

const toRoute = (...segments: Segment[]): string =>
  list(...segments)
    .mapDefined(s => s.segment)
    .join('/');

const parse = (route: string, p: Prop): string => route.replace(p.segment.segment, p.value.toString());

export type Uri = {
  id: (id?: unknown) => Uri;
  query: (q?: unknown) => Uri;
  path: string;
  route: string;
  toString: () => string;
};

export class EasyUri implements Uri {
  static readonly id = uri.path('id');
  static readonly query = uri.query('q');

  readonly host = uri.host();
  readonly resource = uri.resource(this);

  constructor(readonly segments: Segment[], private props = list<Prop>()) {}

  get route(): string {
    return toRoute(uri.segment(''), ...this.segments);
  }

  get path(): string {
    return toRoute(uri.segment(''), this.resource, ...this.segments);
  }

  get complete(): string {
    return toRoute(this.host, this.resource, ...this.segments);
  }

  set = (segment: Segment, value: unknown): this => {
    this.props.push({ segment, value });
    return this;
  };

  toString(): string {
    const route = this.props.reduce((r: string, p: Prop) => parse(r, p), this.complete);
    const query = this.props.mapDefined(p => (p.segment?.query ? p.segment?.query(p.value) : undefined))?.join('&');
    this.props = list<Prop>();
    return isNotEmpty(query) ? `${route}?${query}` : route;
  }

  id = (id?: unknown): this => this.set(EasyUri.id, id);
  query = (q?: unknown): this => this.set(EasyUri.query, q);
}
