import { Json, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { RequestOptions } from './RequestOptions';
import { RestResult } from './RestResult';

export type Request = {
  uri: Uri,
  verb: HttpVerb,
  body?: Json,
  transform?: (r: any) => any,
  options?: RequestOptions
}

export interface RequestProvider {
  execute: (request: Request) => Promise<RestResult>;
}
