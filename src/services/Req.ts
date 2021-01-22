import { Id, Json, JsonValue, Text } from '../types';

export class Req {
  constructor(readonly path: Json = {}, readonly query: Json = {}, readonly body: unknown) {}

  get id(): Id {
    return this.get('id');
  }

  get q(): JsonValue {
    return this.get('q');
  }

  get = (key: Text): any => this.path[key.toString()] ?? this.query[key.toString()];
}

export const toReq = (req: { params?: { id?: unknown }; query?: { q?: unknown }; body?: unknown }): Req =>
  new Req(req.params as Json, req.query as Json, req.body as Json);
