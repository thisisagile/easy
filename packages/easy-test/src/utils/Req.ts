import { Id, Json, JsonValue, Text } from './Types';

export class Req {
  constructor(readonly state: any = {}) {
  }

  get id(): Id {
    return this.state.id ?? this.path.id;
  }

  get q(): JsonValue {
    return this.state.q ?? this.query.q;
  }

  get skip(): number | undefined {
    return this.state?.query.skip;
  }

  get take(): number | undefined {
    return this.state?.query.take;
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

  get = (key: Text): any => this?.state[key.toString()] ?? this.path[key.toString()] ?? this.query[key.toString()];
}
