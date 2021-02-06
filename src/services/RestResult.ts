import { isDefined, isResult, Json, list, List, toResult, Result, toList } from '../types';
import { choose } from '../utils';
import { HttpStatus, isHttpStatus } from './HttpStatus';

export type RestResult = {
  data?: { code: number; items: List<Json>; itemCount: number };
  error?: { code: number; message: string; errorCount: number; errors: List<Result> };
};

const data = (items?: Json[]): RestResult => ({
  data: {
    code: HttpStatus.Ok.status,
    items: list(items),
    itemCount: items.length,
  },
});

const error = (status: HttpStatus, errors: Result[] = []): RestResult => ({
  error: {
    code: status.status,
    message: errors[0]?.message.toString() ?? status.name,
    errors: list(errors),
    errorCount: errors?.length ?? 1,
  },
});

export const isRestResult = (r: unknown): r is RestResult => isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));

export const toRestResult = (payload?: any | any[]): RestResult =>
  choose<RestResult, any>(payload)
    .case(
      p => !p,
      () => data()
    )
    .case(
      p => isHttpStatus(p),
      p => error(p, [toResult(p.name)])
    )
    .case(
      p => isResult(p),
      p => error(HttpStatus.BadRequest, [p])
    )
    .case(
      p => p.error && p.error.errors,
      p => error(HttpStatus.BadRequest, p.error.errors)
    )
    .case(
      p => p.data && p.data.items,
      p => data(p.data.items)
    )
    .else(p => data(toList(p)));
