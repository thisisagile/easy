import { asNumber, Id, Json, JsonValue, PageOptions, Text } from '../types';

export class Req implements Omit<PageOptions, 'sort'> {
  constructor(readonly path: Json = {}, readonly query: Json = {}, readonly body: unknown) {}

  get id(): Id {
    return this.get('id');
  }

  get q(): JsonValue {
    return this.get('q');
  }

  readonly skip = asNumber(this.query?.skip);
  readonly take = asNumber(this.query?.take);

  get = (key: Text): any => this.path[key.toString()] ?? this.query[key.toString()];
}

export const toReq = (req: { params?: { id?: unknown }; query?: { q?: unknown }; body?: unknown }): Req =>
  new Req(req.params as Json, req.query as Json, req.body as Json);
