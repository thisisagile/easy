import { cacheAge } from '../types/CacheAge';
import { ctx } from '../types/Context';
import { isEmpty } from '../types/Is';
import * as HttpStatus from '../http/HttpStatus';
import { isRestResult } from '../http/RestResult';
import { Request } from '../http/Request';
import { RequestOptions } from '../http/RequestOptions';
import { RequestProvider } from '../http/RequestProvider';
import { Interceptors, RequestInterceptor } from '../http/RequestInterceptor';
import { on } from '../types/Constructor';
import { Response } from '../http/Response';
import { toResponse } from '../http/toResponse';
import { toResult } from '../types/Result';
import { Uri } from '../types/Uri';

const readBody = async (response: globalThis.Response): Promise<unknown> => {
  const body = await response.text();
  if (!body) return undefined;
  return response.headers.get('content-type')?.includes('json') ? JSON.parse(body) : body;
};

const requestBody = (request: Request, options: RequestOptions): BodyInit | undefined => {
  if (request.body === undefined) return undefined;
  const encoded = options.type.encode(request.body);
  return options.type.type === 'application/json' && typeof encoded !== 'string' ? JSON.stringify(encoded) : encoded;
};

const responseHeaders = (response: globalThis.Response): Record<string, string> => Object.fromEntries(response.headers.entries());

type FetchError = { response?: { status: number; statusText: string; data: unknown; headers: Record<string, string> }; message?: string };

const asResponse = (uri: Uri, error: unknown): Response => {
  const failure = error as FetchError | null;
  const received = failure?.response;
  if (received) {
    const body = isRestResult(received.data) ? received.data : toResult(received.statusText, uri.path, uri);
    return toResponse(received.status, body, received.headers);
  }
  const message = error instanceof Error ? error.message : (failure?.message ?? String(error));
  return toResponse(HttpStatus.InternalServerError, toResult(message, uri.path, uri));
};

const redirectedRequest = (from: string, to: string, status: number, init: RequestInit): RequestInit => {
  const headers = new Headers(init.headers);
  if (new URL(from).origin !== new URL(to).origin) headers.delete('Authorization');
  const switchToGet = status === 303 || ((status === 301 || status === 302) && init.method?.toLowerCase() === 'post');
  if (!switchToGet) return { ...init, headers };
  headers.delete('Content-Type');
  return { ...init, headers, method: 'get', body: undefined };
};

const fetchWithRedirects = async (fetcher: typeof fetch, url: string, init: RequestInit, limit?: number): Promise<globalThis.Response> => {
  if (limit === undefined) return fetcher(url, init);
  let next = url;
  let request = init;
  for (let redirects = 0; redirects <= limit; redirects++) {
    const response = await fetcher(next, { ...request, redirect: 'manual' });
    const location = response.headers.get('location');
    if (!response.status.toString().startsWith('3') || !location) return response;
    if (redirects === limit) throw new Error('Maximum redirects exceeded');
    const destination = new URL(location, next).toString();
    request = redirectedRequest(next, destination, response.status, request);
    next = destination;
  }
  throw new Error('Maximum redirects exceeded');
};

const toInit = ({ uri, verb, body, options = RequestOptions.Json }: Request, signal: AbortSignal): RequestInit & { headers: Record<string, string> } => ({
  method: verb.toString(),
  headers: uri.isInternal && isEmpty(options.headers.Authorization) ? options.bearer(ctx.request.jwt).headers : options.headers,
  body: requestBody({ uri, verb, body }, options),
  signal,
});

export class FetchProvider implements RequestProvider {
  readonly interceptors = new Interceptors();

  constructor(readonly fetch: typeof globalThis.fetch = globalThis.fetch) {}

  intercept = (...interceptors: RequestInterceptor[]): this => on(this, t => t.interceptors.add(...interceptors));

  execute = async (request: Request): Promise<Response> => {
    const { uri, transform = r => r, transformError = r => r, options = RequestOptions.Json } = request;
    const url = uri.toString();
    const controller = new AbortController();
    const timeout = options.requestOptions.timeout;
    const timer = timeout === undefined ? undefined : setTimeout(() => controller.abort(), cacheAge.toMilliseconds(timeout));
    const init = toInit(request, controller.signal);
    this.interceptors.request({ request, url, method: String(init.method), headers: { ...init.headers }, body: init.body });

    try {
      const response = await fetchWithRedirects(this.fetch, url, init, options.requestOptions.maxRedirects);
      const data = await readBody(response);
      const received = responseHeaders(response);
      const valid = options.requestOptions.validateStatus?.(response.status) ?? response.ok;
      if (!valid) throw { response: { status: response.status, statusText: response.statusText, data, headers: received } };
      this.interceptors.response({ request, url, status: response.status, headers: received, data });
      return toResponse(response.status, transform(data), received);
    } catch (error) {
      const received = (error as FetchError | null)?.response;
      this.interceptors.error({ request, url, status: received?.status, headers: received?.headers, data: received?.data, error });
      throw asResponse(uri, transformError(error));
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  };
}
