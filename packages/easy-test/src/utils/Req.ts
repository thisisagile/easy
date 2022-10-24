import { asNumber, ifDefined } from './Utils';
import { Id, Json, JsonValue, Text } from './Types';

export class Req {
  constructor(readonly state: any = {}) {}

  get id(): Id {
    return this.state.id ?? this.path.id;
  }

  get q(): JsonValue {
    return this.state.q ?? this.query.q;
  }

  readonly skip = ifDefined(this.query?.skip, asNumber(this.query?.skip));
  readonly take = ifDefined(this.query?.take, asNumber(this.query?.take));

  get path(): Json {
    return this.state?.path ?? {};
  }

  get query(): Json {
    return this.state?.query ?? {};
  }

  get body(): unknown {
    return this.state.body;
  }

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
