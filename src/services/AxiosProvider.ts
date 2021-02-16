import axios, { AxiosError, Method } from 'axios';
import { Request, Response, RequestProvider, toResponse } from './RequestProvider';
import { RequestOptions } from './RequestOptions';
import { isDefined, toResult, Uri } from '../types';
import { choose } from '../utils';
import { HttpVerb } from './HttpVerb';
import { HttpStatus } from './HttpStatus';

const asResponse = (uri: Uri, verb: HttpVerb, error: AxiosError): Response =>
  choose<Response, AxiosError>(error)
    .case(
      e => isDefined(e.response),
      e => toResponse(e.response.status, e.response.headers, toResult(e.response.statusText, verb, uri))
    )
    .case(
      e => isDefined(e.request),
      e => toResponse(e.request.status, e.request.headers, toResult(e.request.statusText, verb, uri))
    )
    .else(e => toResponse(HttpStatus.InternalServerError.status, {}, toResult(e.message, verb, uri)));

export class AxiosProvider implements RequestProvider {
  execute = ({ uri, verb, body, transform = (r: any) => r, options = RequestOptions.Json }: Request): Promise<Response> =>
    axios
      .request({
        url: uri.toString(),
        method: verb.toString() as Method,
        headers: options.headers,
        data: body,
      })
      .then(r => toResponse(r.status, r.headers, transform(r.data)))
      .catch(e => Promise.reject(asResponse(uri, verb, e)));
}
