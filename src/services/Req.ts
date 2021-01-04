import { Id, Json, JsonValue } from '../types';

export type Req = { path?: any; id?: Id; query?: any; q?: JsonValue; body?: Json };

export const toReq = (req: { params?: { id?: unknown }; query?: { q?: unknown }; body?: unknown }): Req => ({
  path: req.params,
  id: req.params?.id as Id,
  query: req.query,
  q: req.query?.q as Json,
  body: req.body as Json,
});
