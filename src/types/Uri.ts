import { isNotEmpty } from './Is';
import { list } from './List';

export type Segment = { key: string, segment?: string, query?: (value: unknown) => string };

export const uri = {

  host: (key?: string): Segment => ({
    key,
    segment: key ?? '$host',
  }),

  segment: (key?: string): Segment => ({
    key,
    segment: key,
  }),

  path: (key: string): Segment => ({
    key,
    segment: `:${key}`,
  }),

  query: (key: string): Segment => ({
    key,
    query: (value: unknown): string => value ? `${key}=${value}` : undefined,
  }),
};

type Prop = { segment: Segment, value: unknown };

const parse = (route: string, p: Prop): string => route.replace(p.segment.segment, p.value.toString());

export class Uri {
  static readonly id = uri.path('id');
  static readonly query = uri.query('q');
  readonly host = uri.host();
  readonly resource = uri.segment('$resource');

  constructor(readonly segments: Segment[], private props = list<Prop>()) {}

  get route(): string { return list(uri.segment(""), ...this.segments).mapDefined(s => s.segment).join('/'); }

  get complete(): string { return list(this.host, this.resource, ...this.segments).mapDefined(s => s.segment).join('/'); }

  set = (segment: Segment, value: unknown): this => {
    this.props.push({ segment, value });
    return this;
  };

  toString(): string {
    const route = this.props.reduce((r: string, p: Prop) => parse(r, p), this.complete);
    const q = this.props.mapDefined(p => p.segment?.query ? p.segment?.query(p.value) : undefined)?.join('&');
    this.props = list<Prop>();
    return isNotEmpty(q) ? `${route}?${q}` : route;
  }

  id = (id?: unknown): this => this.set(Uri.id, id);
  query = (q?: unknown): this => this.set(Uri.query, q);
}
