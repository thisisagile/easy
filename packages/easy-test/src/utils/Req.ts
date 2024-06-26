import { asNumber, isDefined } from './Utils';
import { Id, Json, JsonValue, OneOrMore, Text } from './Types';

export class Req<B = unknown> {
  readonly skip: number | undefined;
  readonly take: number | undefined;

  constructor(readonly state: any = {}) {
    this.skip = isDefined(this.query?.skip) ? asNumber(this.query?.skip) : undefined;
    this.take = isDefined(this.query?.take) ? asNumber(this.query?.take) : undefined;
  }

  get id(): Id {
    return this.state.id ?? this.path.id;
  }

  get q(): JsonValue {
    return this.state.q ?? this.query.q;
  }

  get path(): Json {
    return this.state?.path ?? {};
  }

  get query(): Json {
    return this.state?.query ?? {};
  }

  get body(): B {
    return this.state.body;
  }

  get headers(): Record<string, OneOrMore<string>> {
    return this.state.headers;
  }

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
