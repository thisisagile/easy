import {
  Id,
  isDefined,
  isError,
  isResult,
  isResults,
  isUndefined,
  Json,
  List,
  Result,
  toList,
  toResult,
} from '../types';
import { choose } from '../utils';
import { HttpStatus, isHttpStatus } from './HttpStatus';
import { isResponse } from './Response';

export type RestResult = {
  data?: { code: number; items: List<Json>; itemCount: number };
  error?: { code: number; message: string; errorCount: number; errors: List<Result> };
};

const hasErrors = (a: any): a is { error: { code: number, errors: List<Result> } } => isDefined(a?.error?.errors);
const hasItems = (a: any): a is { data: { code: number, items: List<Json> } } => isDefined(a?.data.items);

export const rest = {
  toData: (status: HttpStatus, items: Json[] = []): RestResult => ({
    data: {
      code: status.status,
      items: toList(items),
      itemCount: items.length,
    },
  }),
  toError: (status: HttpStatus, errors: Result[] = [toResult(status.name)]): RestResult => ({
    error: {
      code: status.status,
      message: status.name ?? errors[0].message ?? 'Unknown',
      errors: toList(errors),
      errorCount: errors.length,
    },
  }),
  to: (payload?: any | any[], status?: HttpStatus): RestResult =>
    choose<RestResult, any>(payload)
      .type(isUndefined, p => p)
      .type(isHttpStatus, h => rest.toError(h ?? status ?? HttpStatus.InternalServerError, [toResult(h.name)]))
      .type(isResult, r => rest.toError(status ?? HttpStatus.BadRequest, [r]))
      .type(isError, e => rest.toError(status ?? HttpStatus.BadRequest, [e]))
      .type(isResults, r => rest.toError(status ?? HttpStatus.BadRequest, r.results))
      .type(isResponse, r => rest.toError(status ?? HttpStatus.byId(r.body.error?.code as Id), r.body.error?.errors))
      .type(hasErrors, e => rest.toError(status ?? HttpStatus.byId(e.error.code, HttpStatus.BadRequest), e.error.errors))
      .type(hasItems, d => rest.toData(status ?? HttpStatus.byId(d.data.code, HttpStatus.Ok), d.data.items))
      .else(p => rest.toData(status ?? HttpStatus.Ok, toList(p))),
};

export const isRestResult = (r: unknown): r is RestResult => isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));
