import { isDefined, isResult, Json, Result } from '../types';
import { choose } from '../utils';
import { list, List, toList } from '../types/List';

export type RestResult = {
  data?: { items: List<Json>; itemCount: number; },
  error?: { code: number; message: string, errorCount: number, errors: List<Result>; }
}

const data = (items?: Json[]): RestResult => ({
  data: {
    items: list(items),
    itemCount: items.length
  }
});

const error = (errors: Result[]): RestResult => ({
  error: {
    errorCount: errors.length,
    code: 400,
    message: errors[0].message.toString() ?? 'Unknown error',
    errors: list(errors),
  },
});

export const isRestResult = (r: unknown): r is RestResult =>
  isDefined(r) && (isDefined((r as RestResult).data) || isDefined((r as RestResult).error));

export const toRestResult = (payload?: any | any[]): RestResult =>
  choose<RestResult, any>(payload)
    .case(p => !p, () => data())
    .case(p => isResult(p), p => error([p]))
    .case(p => p.error && p.error.errors, p => error(p.error.errors))
    .case(p => p.data && p.data.items, p => data(p.data.items))
    .else(p => data(toList(p)));
