import { cacheAge } from '../types/CacheAge';
import { ctx } from '../types/Context';
import { isEmpty } from '../types/Is';
import { HttpStatus } from '../http/HttpStatus';
import { isRestResult } from '../http/RestResult';
import { Request } from '../http/Request';
import { RequestOptions } from '../http/RequestOptions';
import { RequestProvider } from '../http/RequestProvider';
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

export class FetchProvider implements RequestProvider {
  constructor(readonly fetch: typeof globalThis.fetch = globalThis.fetch) {}

  execute = async ({ uri, verb, body, transform = r => r, transformError = r => r, options = RequestOptions.Json }: Request): Promise<Response> => {
    const headers = uri.isInternal && isEmpty(options.headers.Authorization) ? options.bearer(ctx.request.jwt).headers : options.headers;
    const controller = new AbortController();
    const timeout = options.requestOptions.timeout;
    const timer = timeout === undefined ? undefined : setTimeout(() => controller.abort(), cacheAge.toMilliseconds(timeout));

    try {
      const response = await fetchWithRedirects(
        this.fetch,
        uri.toString(),
        {
          method: verb.toString(),
          headers,
          body: requestBody({ uri, verb, body }, options),
          signal: controller.signal,
        },
        options.requestOptions.maxRedirects
      );
      const data = await readBody(response);
      const received = responseHeaders(response);
      const valid = options.requestOptions.validateStatus?.(response.status) ?? response.ok;
      if (valid) return toResponse(response.status, transform(data), received);
      throw { response: { status: response.status, statusText: response.statusText, data, headers: received } };
    } catch (error) {
      const transformed = transformError(error);
      throw asResponse(uri, transformed);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  };
}
