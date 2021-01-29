import { Uuid } from '../types';

export type EnvContext = {
  readonly domain: string;
  readonly host: string;
  readonly port: number;
};

export class DotEnvContext implements EnvContext {
  readonly domain = process.env.DOMAIN ?? 'easy';
  readonly host = process.env.HOST;
  readonly port = 8080;
}

export type RequestContext = {
  token?: any;
  correlationId?: Uuid;
};

export class Context {
  get env(): EnvContext {
    return (this.state.env = this.state.env ?? new DotEnvContext());
  }
  get request(): RequestContext {
    return this.state.request;
  }
  get other(): any {
    return this.state.other;
  }

  constructor(protected state: any = { request: {}, other: {} }) {}
}

export const ctx = new Context();
