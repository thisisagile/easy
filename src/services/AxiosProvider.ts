import axios, { AxiosError, Method } from 'axios';
import { Request, RequestProvider } from './RequestProvider';
import { RequestOptions } from './RequestOptions';
import { RestResult, toRestResult } from './RestResult';
import { isDefined, toResult, Result, Uri } from '../types';
import { choose } from '../utils';
import { HttpVerb } from './HttpVerb';

const asResult = (uri: Uri, verb: HttpVerb, error: AxiosError): Result =>
  choose<Result, AxiosError>(error)
    .case(
      e => isDefined(e.response),
      e => toResult(e.response.statusText, verb, uri)
    )
    .case(
      e => isDefined(e.request),
      e => toResult(e.request.statusText, verb, uri)
    )
    .else(e => toResult(e.message, verb, uri));

export class AxiosProvider implements RequestProvider {
  execute = ({ uri, verb, body, transform = (r: any) => r, options = RequestOptions.Json }: Request): Promise<RestResult> =>
    axios
      .request({
        url: uri.toString(),
        method: verb.toString() as Method,
        headers: options.headers,
        data: body,
      })
      .then(r => transform(r))
      .catch(e => asResult(uri, verb, e))
      .then(r => toRestResult(r));
}
