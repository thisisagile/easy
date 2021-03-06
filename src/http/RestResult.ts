import { isDefined, isError, isResult, isResults, Json, list, List, Result, toList, toResult } from '../types';
import { choose } from '../utils';
import { HttpStatus, isHttpStatus } from './HttpStatus';
import { isResponse } from './Response';

export type RestResult = {
  data?: { code: number; items: List<Json>; itemCount: number };
  error?: { code: number; message: string; errorCount: number; errors: List<Result> };
};

export const rest = {
  toData: (status: HttpStatus, items: Json[] = []): RestResult => ({
    data: {
      code: status.status,
      items: list(items),
      itemCount: items.length,
    },
  }),
  toError: (status: HttpStatus, errors: Result[] = [toResult(status.name)]): RestResult => ({
    error: {
      code: status.status,
      message: status.name ?? errors[0].message ?? 'Unknown',
      errors: list(errors),
      errorCount: errors.length,
    },
  }),
  to: (payload?: any | any[], status?: HttpStatus): RestResult =>
    choose<RestResult, any>(payload)
      .case(
        p => !isDefined(p),
        p => p
      )
      .case(
        p => isHttpStatus(p),
        p => rest.toError(p ?? status ?? HttpStatus.InternalServerError, [toResult(p.name)])
      )
      .case(
        p => isResult(p) || isError(p),
        p => rest.toError(status ?? HttpStatus.BadRequest, [p])
      )
      .case(
        p => isResults(p),
        p => rest.toError(status ?? HttpStatus.BadRequest, p.results)
      )
      .case(
        p => isResponse(p),
        p => rest.toError(status ?? HttpStatus.byId(p.body.error?.code), p.body.error?.errors)
      )
      .case(
        p => p.error && p.error.errors,
        p => rest.toError(status ?? HttpStatus.byId(p.error.code, HttpStatus.BadRequest), p.error.errors)
      )
      .case(
        p => p.data && p.data.items,
        p => rest.toData(status ?? HttpStatus.byId(p.data.code, HttpStatus.Ok), p.data.items)
      )
      .else(p => rest.toData(status ?? HttpStatus.Ok, toList(p))),
};

export const isRestResult = (r: unknown): r is RestResult => isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));
