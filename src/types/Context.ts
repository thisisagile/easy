import { Uuid } from './Uuid';
import { createNamespace } from 'cls-hooked';
import { text } from './Text';

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
  jwt: string;
  correlationId?: Uuid;
  create: (f: () => void) => void;
};

export class NamespaceContext implements RequestContext {
  private readonly namespace = createNamespace('context');

  get token(): unknown {
    return this.namespace.get('token');
  }

  set token(token: unknown) {
    this.namespace.set('token', token);
  }

  get jwt(): string {
    return this.namespace.get('jwt');
  }

  set jwt(jwt: string) {
    this.namespace.set('jwt', jwt);
  }

  get correlationId(): Uuid {
    return this.namespace.get('correlationId');
  }

  set correlationId(id: Uuid) {
    this.namespace.set('correlationId', id);
  }

  public get(key: string): any {
    return this.namespace.get(key);
  }

  public set<T>(key: string, value: T): T {
    return this.namespace.set(key, value);
  }

  public readonly create = (f: () => void): void => this.namespace.run(f);
}

export class Context {
  constructor(protected state: any = { other: {} }) {
  }

  get env(): EnvContext {
    return (this.state.env = this.state.env ?? new DotEnvContext());
  }

  get request(): RequestContext {
    return (this.state.request = this.state.request ?? new NamespaceContext());
  }

  get other(): any {
    return this.state.other;
  }
}

export const ctx = new Context();
