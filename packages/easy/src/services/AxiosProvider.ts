import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { toResponse } from '../http/toResponse';
import { isDefined, isEmpty } from '../types/Is';
import { Uri } from '../types/Uri';
import { HttpVerb } from '../http/HttpVerb';
import { choose } from '../types/Case';
import { isRestResult } from '../http/RestResult';
import { toResult } from '../types/Result';
import { HttpStatus } from '../http/HttpStatus';
import { RequestProvider } from '../http/RequestProvider';
import { RequestOptions } from '../http/RequestOptions';
import { Interceptors, RequestInterceptor } from '../http/RequestInterceptor';
import { ctx } from '../types/Context';
import { cacheAge } from '../types/CacheAge';
import { on } from '../types/Constructor';
import { Response } from '../http/Response';
import { Request } from '../http/Request';

const isResponse = (a: unknown): a is { response: AxiosResponse } => isDefined((a as any)?.response);
const isRequest = (a: unknown): a is { request: any } => isDefined((a as any)?.request);

const asResponse = (uri: Uri, verb: HttpVerb, error: AxiosError): Response =>
  choose(error)
    .type(isResponse, r =>
      toResponse(r.response.status, isRestResult(r.response.data) ? r.response.data : toResult(r.response.statusText, uri.path, uri), r.response.headers)
    )
    .type(isRequest, r => toResponse(r.request.status, toResult(r.request.message, uri.path, uri)))
    .else(e => toResponse(HttpStatus.InternalServerError, toResult(e.message, uri.path, uri)));

// Loaded on first use, so bundles that never send a request through axios don't ship it.
const defaultAxios = async (): Promise<AxiosInstance> => (await import('axios')).default;

const toConfig = ({ uri, verb, body, options = RequestOptions.Json }: Request): AxiosRequestConfig => ({
  url: uri.toString(),
  method: verb.toString() as Method,
  headers: uri.isInternal && isEmpty(options.headers.Authorization) ? options.bearer(ctx.request.jwt).headers : options.headers,
  data: options.type.encode(body),
  maxRedirects: options.requestOptions.maxRedirects,
  ...(options.requestOptions.timeout && { timeout: cacheAge.toMilliseconds(options?.requestOptions.timeout) }),
  ...(options.requestOptions.validateStatus && { validateStatus: options.requestOptions.validateStatus }),
});

export class AxiosProvider implements RequestProvider {
  readonly interceptors = new Interceptors();

  constructor(readonly ai?: AxiosInstance) {}

  intercept = (...interceptors: RequestInterceptor[]): this => on(this, t => t.interceptors.add(...interceptors));

  execute = async (request: Request): Promise<Response> => {
    const { uri, verb, transform = (r: any) => r, transformError = (r: any) => r } = request;
    const config = toConfig(request);
    const url = config.url ?? uri.toString();
    const ai = this.ai ?? (await defaultAxios());
    this.interceptors.request({ request, url, method: verb.toString(), headers: { ...config.headers }, body: config.data });
    return ai
      .request(config)
      .then(r => {
        this.interceptors.response({ request, url, status: r.status, headers: { ...r.headers }, data: r.data });
        return toResponse(r.status, transform(r.data), r.headers);
      })
      .catch(e => {
        this.interceptors.error({ request, url, status: e?.response?.status, headers: e?.response?.headers, data: e?.response?.data, error: e });
        return Promise.reject(asResponse(uri, verb, transformError(e)));
      });
  };
}
