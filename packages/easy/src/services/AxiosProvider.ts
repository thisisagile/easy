import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';
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
import { ctx } from '../types/Context';
import { cacheAge } from '../types/CacheAge';
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

export class AxiosProvider implements RequestProvider {
  constructor(readonly ai: AxiosInstance = axios) {}

  execute = ({ uri, verb, body, transform = (r: any) => r, transformError = (r: any) => r, options = RequestOptions.Json }: Request): Promise<Response> =>
    this.ai
      .request({
        url: uri.toString(),
        method: verb.toString() as Method,
        headers: uri.isInternal && isEmpty(options.headers.Authorization) ? options.bearer(ctx.request.jwt).headers : options.headers,
        data: options.type.encode(body),
        maxRedirects: options.requestOptions.maxRedirects,
        ...(options.requestOptions.timeout && { timeout: cacheAge.toMilliseconds(options?.requestOptions.timeout) }),
        ...(options.requestOptions.validateStatus && { validateStatus: options.requestOptions.validateStatus }),
      })
      .then(r => toResponse(r.status, transform(r.data), r.headers))
      .catch(e => Promise.reject(asResponse(uri, verb, transformError(e))));
}
