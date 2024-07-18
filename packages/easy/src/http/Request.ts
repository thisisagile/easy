import { HttpVerb } from './HttpVerb';
import { RequestOptions } from './RequestOptions';
import type { Uri } from '../types/Uri';

export type Request = {
  uri: Uri;
  verb: HttpVerb;
  body?: unknown;
  transform?: (r: any) => any;
  transformError?: (r: any) => any;
  options?: RequestOptions;
};
