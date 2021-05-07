import { Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { RequestOptions } from './RequestOptions';

export type Request = {
  uri: Uri;
  verb: HttpVerb;
  body?: unknown;
  transform?: (r: any) => any;
  options?: RequestOptions;
};
