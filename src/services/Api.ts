import { Uri } from '../types';
import { HttpVerb, RequestOptions, RequestProvider, Response } from '../http';
import { AxiosProvider } from './AxiosProvider';

export class Api {
  constructor(readonly provider: RequestProvider = new AxiosProvider()) {}

  get = (uri: Uri, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Get, transform, options });

  post = (uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Post, body, transform, options });

  put = (uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Put, body, transform, options });

  patch = (uri: Uri, body?: unknown, options: RequestOptions = RequestOptions.Json, transform?: (r: any) => any): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Patch, body, transform, options });

  delete = (uri: Uri, options: RequestOptions = RequestOptions.Json, transform?: (b: any) => any): Promise<Response> =>
    this.provider.execute({ uri, verb: HttpVerb.Delete, transform, options });
}

export const api: Api = new Api();
