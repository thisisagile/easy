import { PageOptions, Uri } from '../types';
import { HttpVerb, RequestOptions, RequestProvider, Response, toPageOptions } from '../http';
import { AxiosProvider } from './AxiosProvider';

export class Api {
  constructor(readonly provider: RequestProvider = new AxiosProvider()) {
  }

  get(uri: Uri, options?: RequestOptions | PageOptions, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({
      uri: uri.skip(toPageOptions(options)?.skip).take(toPageOptions(options)?.take),
      verb: HttpVerb.Get,
      transform,
      transformError,
      options: (options instanceof RequestOptions) ? options : RequestOptions.Json,
    });
  }

  post(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Post, body, transform, transformError, options });
  }

  put(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Put, body, transform, transformError, options });
  }

  patch(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Patch, body, transform, transformError, options});
  }

  delete(uri: Uri, options: RequestOptions = RequestOptions.Json, transform?: (b: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Delete, transform, transformError, options });
  }
}

export const api: Api = new Api();
