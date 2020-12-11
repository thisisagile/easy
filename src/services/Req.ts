import { Id, Json, JsonValue } from '../types';

export type Req = {path?: Json, id?: Id, query?: Json, q?: JsonValue, body?: Json };

export const toReq = (req: any): Req => ({
  path: req.params as Json,
  id:  req.params.id as Id,
  query: req.query as Json,
  q: req.query.q as Json,
  body: req.body as Json
});
