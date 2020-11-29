import { Json, Uri } from '../types';
import { RequestOptions } from './RequestOptions';
import { RestResult } from './RestResult';
import { HttpVerb } from './HttpVerb';
import { RequestProvider } from './RequestProvider';
import { AxiosProvider } from './AxiosProvider';

export class Api {
  constructor(readonly provider: RequestProvider = new AxiosProvider()) {}

  get = (uri: Uri, transform?: (r: any) => any, options?: RequestOptions): Promise<RestResult> =>
    this.provider.execute({ uri, verb: HttpVerb.Get, transform, options });

  post = (uri: Uri, body?: Json, transform?: (b: any) => any, options: RequestOptions = RequestOptions.Json): Promise<RestResult> =>
    this.provider.execute({ uri, verb: HttpVerb.Post, body, transform, options });

  put = (uri: Uri, body?: Json, transform?: (b: any) => any, options: RequestOptions = RequestOptions.Json): Promise<RestResult> =>
    this.provider.execute({ uri, verb: HttpVerb.Put, body, transform, options });

  patch = (uri: Uri, body?: Json, transform?: (b: any) => any, options: RequestOptions = RequestOptions.Json): Promise<RestResult> =>
    this.provider.execute({ uri, verb: HttpVerb.Patch, body, transform, options });

  delete = (uri: Uri, transform?: (b: any) => any, options: RequestOptions = RequestOptions.Json): Promise<RestResult> =>
    this.provider.execute({ uri, verb: HttpVerb.Delete, transform, options });
}

export const api = (provider?: RequestProvider): Api => new Api(provider);
