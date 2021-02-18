import { Uuid } from './Uuid';
import { createNamespace } from 'cls-hooked';
import { stringify } from '../utils';

export type EnvContext = {
  readonly domain: string;
  readonly host: string;
  readonly port: number;

  get(key: string, alt?: string): string;
};

export class DotEnvContext implements EnvContext {
  readonly domain = process.env.DOMAIN ?? 'easy';
  readonly host = process.env.HOST;
  readonly port = Number.parseInt(process.env.PORT) || 8080;

  readonly get = (key: string, alt?: string): string => process.env[stringify(key.replace(/([a-z])([A-Z])/g, '$1 $2')).snake] ?? alt;
}

export type RequestContext = {
  token?: any;
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
  get env(): EnvContext {
    return (this.state.env = this.state.env ?? new DotEnvContext());
  }
  get request(): RequestContext {
    return (this.state.request = this.state.request ?? new NamespaceContext());
  }
  get other(): any {
    return this.state.other;
  }

  constructor(protected state: any = { other: {} }) {}
}

export const ctx = new Context();
