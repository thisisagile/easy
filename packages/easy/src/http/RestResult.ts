import { HttpStatus, isHttpStatus } from './HttpStatus';
import { isResponse } from './Response';
import { List, toList } from '../types/List';
import { Json } from '../types/Json';
import { isResult, Result, toResult } from '../types/Result';
import { isDefined, isError } from '../types/Is';
import { choose } from '../types/Case';
import { isResults } from '../types/Results';
import { Id } from '../types/Id';

export type RestResult = {
  data?: { code: number; items: List<Json>; itemCount: number; totalItems?: number; meta?: Json };
  error?: { code: number; message: string; errorCount: number; errors: List<Result> };
};

const hasErrors = (a: any): a is { error: { code: number; errors: List<Result> } } => isDefined(a?.error?.errors);
const hasItems = (a: any): a is { data: { code: number; items: List<Json>; totalItems?: number; meta?: Json } } => isDefined(a?.data.items);

export const rest = {
  toData: (status: HttpStatus, items: Json[] = [], totalItems?: number, meta?: Json): RestResult => ({
    data: {
      code: status.status,
      items: toList(items),
      itemCount: items.length,
      totalItems,
      meta,
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
    choose(payload)
      .is.not.defined(p => p, undefined as unknown as RestResult)
      .type(isHttpStatus, h => rest.toError(h ?? status ?? HttpStatus.InternalServerError, [toResult(h.name)]))
      .type(isResult, r => rest.toError(status ?? HttpStatus.BadRequest, [r]))
      .type(isError, e => rest.toError(status ?? HttpStatus.BadRequest, [e]))
      .type(isResults, r => rest.toError(status ?? HttpStatus.BadRequest, r.results))
      .type(isResponse, r => rest.toError(status ?? HttpStatus.byId(r.body.error?.code as Id), r.body.error?.errors))
      .type(hasErrors, e => rest.toError(status ?? HttpStatus.byId(e.error.code, HttpStatus.BadRequest), e.error.errors))
      .type(hasItems, d => rest.toData(status ?? HttpStatus.byId(d.data.code, HttpStatus.Ok), d.data.items, d.data.totalItems, d.data.meta))
      .else(p => rest.toData(status ?? HttpStatus.Ok, toList(p))),
};

export const isRestResult = (r: unknown): r is RestResult => isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));
