import { Uuid } from './Uuid';
import { text } from './Text';
import { Identity } from './Identity';
import { tryTo } from './Try';

export interface EnvContext {
  readonly domain: string;
  readonly name: string;
  readonly host: string;
  readonly port: number;

  get(key: string, alt?: string): string | undefined;
}

export class DotEnvContext implements EnvContext {
  readonly domain = process.env.DOMAIN ?? 'easy';
  readonly name = process.env.ENVIRONMENT_NAME ?? '';
  readonly host = process.env.HOST ?? '';
  readonly port = Number.parseInt(process.env.PORT ?? '8080');

  readonly get = (key: string, alt?: string): string | undefined =>
    tryTo(() =>
      text(key)
        .map(k => k.replace(/([a-z])([A-Z])/g, '$1 $2'))
        .snake.toString()
    ).map(k => process.env[k] ?? alt).value;
}

export interface RequestContext {
  token?: any;
  identity?: Identity;
  jwt: string;
  correlationId?: Uuid;
  lastError?: string;
  get<T>(key: string): T;
  set<T>(key: string, value: T): T;
  create: (f: () => void) => void;
}

export class BaseRequestContext implements RequestContext {
  private state: any = {};

  get token(): any {
    return this.get('token');
  }

  set token(token: any) {
    this.set('token', token);
  }

  get identity(): Identity {
    return this.token as Identity;
  }

  get jwt(): string {
    return this.get('jwt');
  }

  set jwt(jwt: string) {
    this.set('jwt', jwt);
  }

  get correlationId(): Uuid {
    return this.get('correlationId');
  }

  set correlationId(id: Uuid) {
    this.set('correlationId', id);
  }

  get lastError(): string | undefined {
    return this.get('lastError');
  }

  set lastError(error: string | undefined) {
    this.set('lastError', error);
  }

  public get<T>(key: string): T {
    return this.state[key] as T;
  }

  public set<T>(key: string, value: T): T {
    return (this.state[key] = value);
  }

  public readonly create = (f: () => void): void => f();
}

/**
 * @deprecated Renamed to BaseRequestContext
 */
export class BaseContext extends BaseRequestContext {}

export interface Contexts {
  env?: EnvContext;
  request?: RequestContext;
  other?: any;
}

export class Context {
  constructor(protected state: Contexts = {}) {
    this.state = {
      ...{
        env: new DotEnvContext(),
        request: new BaseRequestContext(),
        other: {},
      },
      ...this.state,
    };
  }

  get env(): EnvContext {
    return this.state.env as EnvContext;
  }

  set env(env: EnvContext) {
    this.state.env = env;
  }

  get request(): RequestContext {
    return this.state.request as RequestContext;
  }

  set request(request: RequestContext) {
    this.state.request = request;
  }

  get other(): any {
    return this.state.other;
  }
}

export const ctx = new Context();
