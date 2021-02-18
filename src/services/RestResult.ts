import { isDefined, isError, isResult, isResults, Json, list, List, Result, toList, toResult } from '../types';
import { choose } from '../utils';
import { HttpStatus, isHttpStatus } from './HttpStatus';
import { isResponse } from './RequestProvider';

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
      message: errors[0].message.toString(),
      errors: list(errors),
      errorCount: errors.length,
    },
  }),
};

export const isRestResult = (r: unknown): r is RestResult => isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));

export const toRestResult = (payload?: any | any[], code?: HttpStatus): RestResult =>
  choose<RestResult, any>(payload)
    .case(
      p => !isDefined(p),
      p => p
    )
    .case(
      p => isHttpStatus(p),
      p => rest.toError(p ?? code ?? HttpStatus.InternalServerError, [toResult(p.name)])
    )
    .case(
      p => isResult(p) || isError(p),
      p => rest.toError(code ?? HttpStatus.BadRequest, [p])
    )
    .case(
      p => isResults(p),
      p => rest.toError(code ?? HttpStatus.BadRequest, p.results)
    )
    .case(
      p => isResponse(p),
      p => rest.toError(code ?? HttpStatus.byId(p.body.error?.code), p.body.error?.errors)
    )
    .case(
      p => p.error && p.error.errors,
      p => rest.toError(code ?? HttpStatus.byId(p.error.code, HttpStatus.BadRequest), p.error.errors)
    )
    .case(
      p => p.data && p.data.items,
      p => rest.toData(code ?? HttpStatus.byId(p.data.code, HttpStatus.Ok), p.data.items)
    )
    .else(p => rest.toData(code ?? HttpStatus.Ok, toList(p)));
