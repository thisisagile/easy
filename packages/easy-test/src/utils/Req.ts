import { asNumber } from './Utils';
import { Id, Json, JsonValue, OneOrMore, Text } from './Types';
import { ifDefined } from '@thisisagile/easy';

export class Req {
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

  get skip(): number | undefined {
    return ifDefined(this.query?.skip, asNumber(this.query?.skip));
  }

  get take(): number | undefined {
    return ifDefined(this.query?.take, asNumber(this.query?.take));
  }

  get body(): unknown {
    return this.state.body;
  }

  get headers(): Record<string, OneOrMore<string>> {
    return this.state.headers;
  }

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
