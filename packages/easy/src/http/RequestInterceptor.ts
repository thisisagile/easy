import { Request } from './Request';

export type Outgoing = { request: Request; url: string; method: string; headers: Record<string, unknown>; body?: unknown };

export type Incoming = { request: Request; url: string; status: number; headers: Record<string, unknown>; data: unknown };

export type Failure = { request: Request; url: string; status?: number; headers?: Record<string, unknown>; data?: unknown; error: unknown };

// Hooks see the raw exchange, before transform and transformError, so logging works the same for every provider.
export type RequestInterceptor = {
  request?: (outgoing: Outgoing) => void;
  response?: (incoming: Incoming) => void;
  error?: (failure: Failure) => void;
};

export class Interceptors {
  private readonly all: RequestInterceptor[] = [];

  add = (...interceptors: RequestInterceptor[]): void => {
    this.all.push(...interceptors);
  };

  request = (outgoing: Outgoing): void => this.all.forEach(i => i.request?.(outgoing));

  response = (incoming: Incoming): void => this.all.forEach(i => i.response?.(incoming));

  error = (failure: Failure): void => this.all.forEach(i => i.error?.(failure));
}
