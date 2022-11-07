import { FetchOptions, Store, Uri } from '../types';
import { HttpVerb, Request, RequestOptions, RequestProvider, Response, toPageOptions } from '../http';
import { AxiosProvider } from './AxiosProvider';

export type RouteOptions = RequestOptions | FetchOptions;

export class Api {
  constructor(readonly provider: RequestProvider = new AxiosProvider(), protected store?: Store<Response, Request>) {}

  get(uri: Uri, options?: RouteOptions, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.execute({
      uri: uri.skip(toPageOptions(options)?.skip).take(toPageOptions(options)?.take),
      verb: HttpVerb.Get,
      transform,
      transformError,
      options: this.options(HttpVerb.Get, options),
    });
  }

  post(uri: Uri, body?: unknown, options: RouteOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.execute({
      uri,
      verb: HttpVerb.Post,
      body,
      transform,
      transformError,
      options: this.options(HttpVerb.Post, options),
    });
  }

  put(uri: Uri, body?: unknown, options: RouteOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.execute({
      uri,
      verb: HttpVerb.Put,
      body,
      transform,
      transformError,
      options: this.options(HttpVerb.Put, options),
    });
  }

  patch(uri: Uri, body?: unknown, options: RouteOptions = RequestOptions.Json, transform?: (r: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.execute({
      uri,
      verb: HttpVerb.Patch,
      body,
      transform,
      transformError,
      options: this.options(HttpVerb.Patch, options),
    });
  }

  delete(uri: Uri, options: RouteOptions = RequestOptions.Json, transform?: (b: any) => any, transformError = (r: any) => r): Promise<Response> {
    return this.execute({
      uri,
      verb: HttpVerb.Delete,
      transform,
      transformError,
      options: this.options(HttpVerb.Delete, options),
    });
  }

  options(verb: HttpVerb, options?: RouteOptions): RequestOptions {
    return options instanceof RequestOptions ? options : RequestOptions.Json;
  }

  execute = (req: Request): Promise<Response> => (this.store ? this.store.execute(req, () => this.provider.execute(req)) : this.provider.execute(req));
}

export const api: Api = new Api();
