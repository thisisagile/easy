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
      options: this.options(HttpVerb.Get, options),
    });
  }

  post(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Post, body, transform, transformError, options: this.options(HttpVerb.Post, options) });
  }

  put(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Put, body, transform, transformError, options: this.options(HttpVerb.Put, options) });
  }

  patch(uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Patch, body, transform, transformError, options: this.options(HttpVerb.Patch, options)});
  }

  delete(uri: Uri, options: RequestOptions = RequestOptions.Json, transform?: (b: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.provider.execute({ uri, verb: HttpVerb.Delete, transform, transformError, options: this.options(HttpVerb.Delete, options) });
  }

  options(verb: HttpVerb, options?: RequestOptions | PageOptions): RequestOptions {
    return (options instanceof RequestOptions) ? options : RequestOptions.Json;
  }
}

export const api: Api = new Api();
