import { Uuid } from './Uuid';
import { text } from './Text';
import { Identity } from './Identity';

export type EnvContext = {
  readonly domain: string;
  readonly name: string;
  readonly host: string;
  readonly port: number;

  get(key: string, alt?: string): string | undefined;
};

export class DotEnvContext implements EnvContext {
  readonly domain = process.env.DOMAIN ?? 'easy';
  readonly name = process.env.ENVIRONMENT_NAME ?? '';
  readonly host = process.env.HOST ?? '';
  readonly port = Number.parseInt(process.env.PORT ?? '8080');

  readonly get = (key: string, alt?: string): string | undefined =>
    process.env[
      text(key)
        .map(k => k.replace(/([a-z])([A-Z])/g, '$1 $2'))
        .snake.toString()
    ] ?? alt;
}

export type RequestContext = {
  token?: any;
  identity?: Identity;
  jwt: string;
  correlationId?: Uuid;
  create: (f: () => void) => void;
};

export class BaseContext implements RequestContext {
  private state: any = {};

  get token(): unknown {
    return this.state.token;
  }

  set token(token: unknown) {
    this.state.token = token;
  }

  get identity(): Identity {
    return this.token as Identity;
  }

  get jwt(): string {
    return this.state.jwt;
  }

  set jwt(jwt: string) {
    this.state.jwt = jwt;
  }

  get correlationId(): Uuid {
    return this.state.correlationId;
  }

  set correlationId(id: Uuid) {
    this.state.correlationId = id;
  }

  public get(key: string): any {
    return this.state[key];
  }

  public set<T>(key: string, value: T): T {
    return this.state[key] = value;
  }

  public readonly create = (f: () => void): void => f();
}

export class Context {
  constructor(protected state: any = { env: new DotEnvContext(), request: new BaseContext(), other: {} }) {}

  get env(): EnvContext {
    return this.state.env;
  }

  set env(env: EnvContext) {
    this.state.env = env;
  }

  get request(): RequestContext {
    return this.state.request;
  }

  set request(request: RequestContext) {
    this.state.request = request;
  }

  get other(): any {
    return this.state.other;
  }
}

export const ctx = new Context();
