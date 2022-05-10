import { PageOptions, Uri } from '../types';
import { HttpVerb, RequestOptions, RequestProvider, Response } from '../http';
import { AxiosProvider } from './AxiosProvider';

export class Api {
  constructor(readonly provider: RequestProvider = new AxiosProvider()) {
  }

  get(uri: Uri, options?: RequestOptions | PageOptions, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({
      uri: (options instanceof RequestOptions) ? uri.skip(options.pageOptions?.skip).take(options.pageOptions?.take) : uri.skip(options?.skip).take(options?.take),
      verb: HttpVerb.Get,
      transform,
      transformError,
      options: (options instanceof RequestOptions) ? options : RequestOptions.Json,
    });
  }

  post = (
    uri: Uri,
    body?: unknown,
    options: RequestOptions = RequestOptions.Json,
    transform?: (r: any) => any,
    transformError = (r: any) => r,
  ): Promise<Response> => this.provider.execute({ uri, verb: HttpVerb.Post, body, transform, transformError, options });

  put = (
    uri: Uri,
    body?: unknown,
    options: RequestOptions = RequestOptions.Json,
    transform?: (r: any) => any,
    transformError = (r: any) => r,
  ): Promise<Response> => this.provider.execute({ uri, verb: HttpVerb.Put, body, transform, transformError, options });

  patch = (
    uri: Uri,
    body?: unknown,
    options: RequestOptions = RequestOptions.Json,
    transform?: (r: any) => any,
    transformError = (r: any) => r,
  ): Promise<Response> => this.provider.execute({
    uri,
    verb: HttpVerb.Patch,
    body,
    transform,
    transformError,
    options,
  });

  delete = (uri: Uri, options: RequestOptions = RequestOptions.Json, transform?: (b: any) => any, transformError = (r: any) => r): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Delete, transform, transformError, options });
}

export const api: Api = new Api();
