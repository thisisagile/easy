import { Uuid } from './Uuid';
import { text } from './Text';
import { Identity } from './Identity';
import { tryTo } from './Try';
import { Construct, ofConstruct } from './Constructor';

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
    tryTo(() =>
      text(key)
        .map(k => k.replace(/([a-z])([A-Z])/g, '$1 $2'))
        .snake.toString(),
    ).map(k => process.env[k] ?? alt).value;
}

export type RequestContext = {
  token?: any;
  identity?: Identity;
  jwt: string;
  correlationId?: Uuid;
  lastError?: string;
  get<T>(key: string): T;
  set<T>(key: string, value: T): T;
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

  get lastError(): string | undefined {
    return this.state.lastError;
  }

  set lastError(error: string | undefined) {
    this.state.lastError = error;
  }

  public get<T>(key: string): T {
    return this.state[key] as T;
  }

  public set<T>(key: string, value: T): T {
    return (this.state[key] = value);
  }

  public readonly create = (f: () => void): void => f();
}

export type Contexts<E extends EnvContext, R extends RequestContext> = {
  env?: E;
  request?: R;
  other?: any;
}

export class Context<E extends EnvContext = DotEnvContext, R extends RequestContext = BaseContext> {
  constructor(protected state: Contexts<E, R> = {}) {
    this.state = {
      ...({
        env: new DotEnvContext() as E,
        request: new BaseContext() as RequestContext as R,
        other: {},
      }), ...this.state,
    };
  }

  get env(): E {
    return this.state.env as E;
  }

  set env(env: E) {
    this.state.env = env;
  }

  get request(): R {
    return this.state.request as R;
  }

  set request(request: R) {
    this.state.request = request;
  }

  get other(): any {
    return this.state.other;
  }

  static use = <E extends EnvContext, R extends RequestContext>({
                                                                  env,
                                                                  request,
                                                                  other,
                                                                }: { env?: Construct<E>, request?: Construct<R>, other?: any }): Context<E, R> => new Context<E, R>({
    env: env && ofConstruct(env),
    request: request && ofConstruct(request),
    other,
  });
}

export const ctx = new Context();
