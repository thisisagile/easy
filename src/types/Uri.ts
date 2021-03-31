import { isNotEmpty } from './Is';
import { asString, Text } from './Text';
import { toName } from './Constructor';
import { ctx } from './Context';
import { toList } from './List';

export type Segment = Text & { key?: string; segment?: string; query?: (value: unknown) => string };

const toSegment = (key?: string, { segment, query }: { segment?: string; query?: (value: unknown) => string } = {}): Segment => ({
  key,
  segment,
  query,
  toString: () => key ?? '',
});

export const uri = {
  host: (key?: string): Segment => toSegment(key, { segment: key ?? ctx.env.host ?? '$host' }),
  resource: (resource: Uri): Segment => toSegment(toName(resource, 'Uri'), { segment: toName(resource, 'Uri') }),
  segment: (key?: string): Segment => toSegment(key, { segment: key }),
  path: (key: string): Segment => toSegment(key, { segment: `:${key}` }),
  query: (key: string): Segment => toSegment(key, { query: (value: unknown): string => (value ? `${key}=${value}` : '') }),
};

type Prop = { segment: Segment; value: any };

const toRoute = (...segments: Segment[]): string =>
  toList(segments)
    .mapDefined(s => s.segment)
    .join('/');

export type Uri = {
  id: (id?: unknown) => Uri;
  query: (q?: unknown) => Uri;
  path: string;
  route: (resource: string) => string;
  toString: () => string;
};

export class EasyUri implements Uri {
  static readonly id = uri.path('id');
  static readonly query = uri.query('q');

  readonly host = uri.host();
  readonly resource = uri.resource(this);

  private props = toList<Prop>();

  constructor(readonly segments: Segment[] = []) {}

  get path(): string {
    return toRoute(uri.segment(''), this.resource, ...this.segments);
  }

  get complete(): string {
    return toRoute(this.host, this.resource, ...this.segments);
  }

  route = (resource: string | undefined = this.resource.key): string => toRoute(uri.segment(''), uri.segment(resource?.toLowerCase()), ...this.segments);

  set = (segment: Segment, value: unknown): this => {
    this.props.push({ segment, value });
    return this;
  };

  toString(): string {
    const route = this.props
      .filter(p => p.segment?.segment)
      .reduce((r: string, p: Prop) => r.replace(asString(p.segment.segment), p.value ?? ''), this.complete);
    const query = this.props.mapDefined(p => (p.segment?.query ? p.segment?.query(p.value) : undefined))?.join('&');
    this.props = toList<Prop>();
    return isNotEmpty(query) ? `${route}?${query}` : route;
  }

  id = (id?: unknown): this => this.set(EasyUri.id, id);
  query = (q?: unknown): this => this.set(EasyUri.query, q);
}
