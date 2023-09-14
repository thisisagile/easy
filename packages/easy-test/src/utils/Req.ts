import { asNumber, isNumber } from './Utils';
import { Id, Json, JsonValue, OneOrMore, Text } from './Types';

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
    return isNumber(this.query?.skip) ? asNumber(this.query?.skip) : undefined;
  }

  get take(): number | undefined {
    return isNumber(this.query?.take) ? asNumber(this.query?.take) : undefined;
  }

  get body(): unknown {
    return this.state.body;
  }

  get headers(): Record<string, OneOrMore<string>> {
    return this.state.headers;
  }

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
