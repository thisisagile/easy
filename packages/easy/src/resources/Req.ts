import { asNumber, Id, Json, JsonValue, OneOrMore, PageOptions, Text } from '../types';
import { ifDefined } from '../utils';

export class Req implements Omit<PageOptions, 'sort'> {
  readonly skip = ifDefined(this.query?.skip, asNumber(this.query?.skip));
  readonly take = ifDefined(this.query?.take, asNumber(this.query?.take));

  constructor(readonly path: Json = {}, readonly query: Json = {}, readonly body: unknown, readonly headers: Record<string, OneOrMore<string>>) {}

  get id(): Id {
    return this.get('id');
  }

  get q(): JsonValue {
    return this.get('q');
  }

  get = (key: Text): any => this.path[key.toString()] ?? this.query[key.toString()];
}

export const toReq = (req: { params?: { id?: unknown }; query?: { q?: unknown }; body?: unknown; headers?: unknown }): Req =>
  new Req(req.params as Json, req.query as Json, req.body as Json, req.headers as Record<string, OneOrMore<string>>);
