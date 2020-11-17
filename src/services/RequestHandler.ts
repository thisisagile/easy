import { Json, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { EasyResponse } from './EasyResponse';

class RequestOptions {
}

export interface RequestHandler {
  handle(uri: Uri, verb: HttpVerb, body?: Json, options?: RequestOptions): Promise<EasyResponse>;
}
