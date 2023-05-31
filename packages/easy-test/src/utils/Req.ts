import { asNumber, isDefined } from './Utils';
import { Id, Json, JsonValue, Text } from './Types';
import { OneOrMore } from '@thisisagile/easy';

export class Req {
  readonly skip = isDefined(this.query?.skip) ? asNumber(this.query?.skip) : undefined;
  readonly take = isDefined(this.query?.take) ? asNumber(this.query?.take) : undefined;

  constructor(readonly state: any = {}) {}

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

  get body(): unknown {
    return this.state.body;
  }

  get headers(): Record<string, OneOrMore<string>> {
    return this.state.headers;
  }

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
