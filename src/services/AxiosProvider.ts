import axios, { AxiosError, Method } from 'axios';
import { Request, RequestProvider } from './RequestProvider';
import { RequestOptions } from './RequestOptions';
import { RestResult, toRestResult } from './RestResult';
import { isDefined, result, Result, Uri } from '../types';
import { choose } from '../utils';
import { HttpVerb } from './HttpVerb';


const toResult = (uri: Uri, verb: HttpVerb, error: AxiosError): Result =>
  choose<Result, AxiosError>(error)
    .case(e => isDefined(e.response), e => result(e.response.statusText, verb.id.toString(), uri.toString()))
    .case(e => isDefined(e.request), e => result(e.request.statusText, verb.id.toString(), uri.toString()))
    .else(e => result(e.message, verb.id.toString(), uri.toString()));

export class AxiosProvider implements RequestProvider {
  execute = ({ uri, verb, body, transform = (r: any) => r, options = RequestOptions.Json }: Request): Promise<RestResult> =>
    axios.request({
      url: uri.toString(),
      method: verb.id as Method,
      headers: options.headers,
      data: body,
      transformResponse: transform,
    })
      .catch(e => toResult(uri, verb, e))
      .then(r => toRestResult(r));
}
