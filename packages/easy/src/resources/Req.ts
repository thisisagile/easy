import { PageOptions } from '../types/PageList';
import { Optional } from '../types/Types';
import { Json, JsonValue } from '../types/Json';
import { OneOrMore } from '../types/Array';
import { ifDefined } from '../utils/If';
import { asNumber } from '../types/Number';
import { Id } from '../types/Id';
import type { Text } from '../types/Text';

export class Req<T = unknown> implements Omit<PageOptions, 'sort'> {
  readonly skip: Optional<number>;
  readonly take: Optional<number>;
  constructor(
    readonly path: Json = {},
    readonly query: Json = {},
    readonly body: T,
    readonly headers: Record<string, OneOrMore<string>>
  ) {
    this.skip = ifDefined(query.skip, s => asNumber(s));
    this.take = ifDefined(query.take, t => asNumber(t));
  }

  get id(): Id {
    return this.get('id');
  }

  get q(): JsonValue {
    return this.get('q');
  }

  get = (key: Text): any => this.path[key.toString()] ?? this.query[key.toString()];
}

export function toReq<T = unknown>(req: { params?: { id?: unknown }; query?: { q?: unknown }; body?: T; headers?: unknown }): Req {
  return new Req(req.params as Json, req.query as Json, req.body as Json, req.headers as Record<string, OneOrMore<string>>);
}
