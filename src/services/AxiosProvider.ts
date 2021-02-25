import axios, { AxiosError, Method } from 'axios';
import { HttpStatus, HttpVerb, isRestResult, Request, RequestOptions, RequestProvider, Response, toResponse } from '../http';
import { isDefined, toResult, Uri } from '../types';
import { choose } from '../utils';

const asResponse = (uri: Uri, verb: HttpVerb, error: AxiosError): Response =>
  choose<Response, AxiosError>(error)
    .case(
      e => isDefined(e.response),
      e => toResponse(e.response.status, isRestResult(e.response.data) ? e.response.data : toResult(e.response.statusText, uri.path, uri), e.response.headers)
    )
    .case(
      e => isDefined(e.request),
      e => toResponse(e.request.status, toResult(e.request.message, uri.path, uri))
    )
    .else(e => toResponse(HttpStatus.InternalServerError, toResult(e.message, uri.path, uri)));

export class AxiosProvider implements RequestProvider {
  execute = ({ uri, verb, body, transform = (r: any) => r, options = RequestOptions.Json }: Request): Promise<Response> =>
    axios
      .request({
        url: uri.toString(),
        method: verb.toString() as Method,
        headers: options.headers,
        data: options.type.encode(body),
      })
      .then(r => toResponse(r.status, transform(r.data), r.headers))
      .catch(e => Promise.reject(asResponse(uri, verb, e)));
}
